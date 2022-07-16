import sha256 from "sha256";

export const encrypt256 = (key) => {
  try {
    return sha256(key);
  } catch (error) {
    console.log("encrypt error", error);
  }
};
