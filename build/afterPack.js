// Firma "ad-hoc" (gratuita, sin certificado de Apple) de la app de Mac, justo después de empaquetarla.
// Sin esto, la firma original de Electron queda rota al empaquetar y macOS en los Mac con chip Apple
// dice que la app "está dañada y no puede abrirse".
const { execFileSync } = require("child_process");
const path = require("path");

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== "darwin") return;
  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);
  console.log(`  • firma ad-hoc  ${appPath}`);
  execFileSync("codesign", ["--force", "--deep", "--sign", "-", appPath], { stdio: "inherit" });
  execFileSync("codesign", ["--verify", "--deep", "--strict", "--verbose=2", appPath], { stdio: "inherit" });
};
