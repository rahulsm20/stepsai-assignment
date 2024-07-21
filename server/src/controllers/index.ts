import { GoogleGenerativeAI } from "@google/generative-ai";
import { RequestHandler } from "express";
import { prisma } from "../../prisma/client";
export const generateDetail: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("User not logged in");
    }
    const patientId = req.user?.id;
    let { query } = req.body;
    if (!patientId) {
      throw new Error("Please login");
    }
    if (!query) {
      throw new Error("Please enter query");
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(query as string);
    if (result.response?.candidates?.length) {
      const message = result.response.candidates[0];
      const { content } = message;
      const generatedMessage = content.parts.map(({ text }) => text).join("\n");
      const messageItem = {
        isResponse: true,
        content: generatedMessage,
        patientId,
      };
      const um = { isResponse: false, content: query, patientId };
      await prisma.message.createMany({
        data: [um, messageItem],
      });
      return res.status(200).json(messageItem);
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
};

export const addUpdateDoctor: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("User not logged in");
    }
    const patientId = req.user?.id;
    const { name, phoneNumber } = req.body;
    if (!name && !phoneNumber) {
      throw new Error("Please enter name or phone number");
    }
    if (!patientId) {
      throw new Error("Please enter patientId");
    }
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
      },
    });
    if (patient) {
      const patientHasDoctor = await prisma.patient.findFirst({
        where: {
          NOT: {
            doctorId: null,
          },
          id: patientId,
        },
      });
      if (patientHasDoctor) {
        throw new Error("Already has doctor");
      }
      const doctor = await prisma.doctor.create({
        data: {
          name,
          phoneNumber,
          patient: { connect: { id: patient.id } },
        },
      });
      return res.status(200).json(doctor);
    } else {
      throw new Error("Patient doesn't exist");
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
};

export const getPatient: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("User not logged in");
    }
    const id = req.user?.id;
    const patient = await prisma.patient.findUnique({
      where: {
        id,
      },
      include: {
        doctor: true,
        interactions: {
          orderBy: {
            interactionDate: "desc",
          },
        },
        messages: true,
      },
    });
    if (patient) {
      const { hashedPassword, ...patientDetails } = patient;
      return res.status(200).json(patientDetails);
    }
  } catch (err) {
    console.log("profile:", err);
    return res.status(404).json(err);
  }
};

export const addInteraction: RequestHandler = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("Please login");
    }
    const { query, response } = req.body;
    const interaction = await prisma.interaction.create({
      data: {
        query,
        response,
        patientId: user.id,
      },
    });
    return res.status(200).json(interaction);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
};

export const getInteractions: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("User not logged in");
    }
    const patientId = req.user?.id;

    const conversations = await prisma.interaction.findMany({
      where: {
        patientId,
      },
    });
    return res.status(200).json(conversations);
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
};

export const getInteractionById: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("User not logged in");
    }
    const patientId = req.user?.id;
    const { id } = req.params;
    if (id) {
      const conversationId = parseInt(id, 10);
      if (isNaN(conversationId)) {
        throw new Error("Invalid conversation ID");
      }
      const conversations = await prisma.interaction.findUnique({
        where: {
          patientId,
          id: conversationId,
        },
      });
      return res.status(200).json(conversations);
    } else {
      throw new Error("Please enter convesation ID");
    }
  } catch (err) {
    console.log(err);
    return res.status(404).json(err);
  }
};
