import { sendPowerUsage, saveDailyPowerUsage, getPowerUsage,getDailyPowerUsage} from "../repository/r-main.js";

export async function savePowerUsageService(current_mA, status) {
  const result = await sendPowerUsage(current_mA, status);
  if (!result) {
    throw new Error("Gagal menyimpan data konsumsi daya ke database");
  }
  return result;
}
export async function saveDailyPowerUsageService(totalPowerUsage) {
  const result = await saveDailyPowerUsage(totalPowerUsage);
  if (!result) {
    throw new Error("Gagal menyimpan total konsumsi daya harian ke database");
  }
  return result;
}


export async function getPowerUsageService() {

  const result = await getPowerUsage();

  if (!result) {
    throw new Error("Gagal mengambil data konsumsi daya");
  }

  return result;
}

export async function getDailyPowerUsageService() {

  const result = await getDailyPowerUsage();

  if (!result) {
    throw new Error("Gagal mengambil data konsumsi daya harian");
  }

  return result;
}