import prisma from "../config/prisma.js";

export async function sendPowerUsage(current_mA, status) {
  try {
    const result = await prisma.powerUsage.create({
      data: {
        current_mA,
        status,
      },
    });
    if (!result) {
      throw new Error("Gagal menyimpan data konsumsi daya ke database");
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}
export async function saveDailyPowerUsage(totalPowerUsage) {
  try {
    const result = await prisma.dailyPowerUsage.create({
      data: {
        totalPowerUsage: totalPowerUsage.toFixed(2),
        timestamp: new Date(),
      },
    });

    if (!result) {
      throw new Error("Gagal menyimpan total konsumsi daya harian ke database");
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function findUser(email) {
  try {
    const result = await prisma.user.findFirst({
      where: {
        email: email
      },
    });
    if (!result) {
      throw new Error("Email not Registered");
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
  
}

export async function getPowerUsage() {

  try {
    const now = new Date();
    const startDay= new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const result = await prisma.powerUsage.findMany({
      where: {
        timestamp: {
          gte: startDay,
          lte: endDay,
        },
      },
    });

    if (!result || result.length === 0) {
      throw new Error("Gagal mengambil data konsumsi daya");
    }

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
  
}

export async function getDailyPowerUsage() {

  try {
    const result = await prisma.dailyPowerUsage.findMany();
    if (!result) {
      throw new Error("Gagal mengambil data konsumsi daya harian");
    }
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
}