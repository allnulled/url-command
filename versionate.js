const { execSync } = require("child_process");
const fs = require("fs");

function createVersionBranch() {
  try {
    // Leer la versión del archivo package.json
    const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const version = packageJson.version;

    if (!version) {
      console.error("No se encontró la versión en package.json.");
      process.exit(1);
    }

    const branchName = `v${version}`;
    console.log(`Preparando para crear la rama de versión: ${branchName}`);

    // Verificar si la rama ya existe (local o remota)
    const existingBranches = execSync("git branch -a", { encoding: "utf8" });

    if (existingBranches.includes(branchName)) {
      console.log(`La rama '${branchName}' ya existe. No se creará una nueva.`);
    } else {
      // Crear la nueva rama basada en la actual
      execSync(`git branch ${branchName}`, { stdio: "inherit" });

      // Subir la nueva rama al remoto
      execSync(`git push origin ${branchName}`, { stdio: "inherit" });

      console.log(`Rama '${branchName}' creada y subida al remoto.`);
    }

    // Volver a la rama predeterminada
    execSync(`git switch main`, { stdio: "inherit" });

    console.log(`Cambiado de vuelta a la rama 'main'.`);

    execSync(`git add .`, { stdio: "inherit" });
    execSync(`git commit`, { stdio: "inherit" });
    execSync(`git push --all`, { stdio: "inherit" });

  } catch (error) {
    console.error("Error al crear la rama de versión:", error.message);
    process.exit(1);
  }
}

createVersionBranch();
