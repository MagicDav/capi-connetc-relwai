import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { arduino } from "../index";

const prisma = new PrismaClient();

// Cadastrar passageiro e gerar QR Code
export const cadastrarPassageiro = async (req: Request, res: Response) => {
  try {
    const { nome, destino, morada } = req.body;

    if (!nome || !destino || !morada) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    const token = jwt.sign({ nome, destino, morada }, "kalepa#$%magic~~~s", {
      expiresIn: "1h",
    });

    const qrCodeData = await QRCode.toDataURL(token);

    const passageiro = await prisma.passageiros.create({
      data: {
        nome,
        destino,
        morada,
        qrcode: qrCodeData,
        status: false,
      },
    });

    res.json({
      message: "Passageiro cadastrado e QR Code gerado!",
      passageiro,
      token,
    });
  } catch (err: any) {
    if (err.code === "P2002" && err.meta?.target?.includes("qrcode")) {
      return res.status(400).json({ error: "QR Code já existe!" });
    }
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Validar QR Code e abrir catraca
export const validarQRCode = async (req: Request, res: Response) => {
  try {
    const { qrcode } = req.body;

    if (!qrcode) {
      arduino.write("0");
      return res.status(400).json({ error: "QR Code é obrigatório" });
    }

    const passageiro = await prisma.passageiros.findFirst({ where: { qrcode } });

    if (!passageiro) {
      arduino.write("0");
      return res.status(404).json({ error: "QR Code não existe ou é inválido" }); 
    }

    if (passageiro.status) {
      arduino.write("0");
      return res.status(400).json({ error: "QR Code já utilizado" });
    }

    await prisma.passageiros.update({
      where: { id: passageiro.id },
      data: { status: true },
    });

    arduino.write("1", (err: any) => {
      if (err) {
        arduino.write("0");
        return res.status(500).json({ error: "Falha ao enviar comando ao Arduino" });
      }
      res.json({ success: true, message: "Catraca aberta!", passageiro });
    });
  } catch (error: any) {
    console.error(error);
    arduino.write("0");
    res.status(500).json({ error: error.message });
  }
};
