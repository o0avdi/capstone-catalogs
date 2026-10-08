import { spawn } from "node:child_process"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const executable = (name) => `${name}${process.platform === "win32" ? ".cmd" : ""}`
const children = []
let stopping = false

function stop(exitCode = 0) {
  if (stopping) return
  stopping = true

  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM")
  }

  setTimeout(() => process.exit(exitCode), 250)
}

function watch(child) {
  children.push(child)

  child.on("error", (error) => {
    console.error(error)
    stop(1)
  })

  child.on("exit", (code, signal) => {
    if (!stopping && (code !== 0 || signal)) stop(code ?? 1)
  })

  return child
}

async function waitForShadcn() {
  const deadline = Date.now() + 60_000

  while (Date.now() < deadline) {
    try {
      const response = await fetch("http://127.0.0.1:6007/index.json")
      if (response.ok) return
    } catch {
      // The React Storybook is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  throw new Error("The shadcn Storybook did not start on port 6007.")
}

process.on("SIGINT", () => stop(0))
process.on("SIGTERM", () => stop(0))

watch(
  spawn(
    join(root, "node_modules", ".bin", executable("storybook")),
    ["dev", "-p", "6007", "--no-open", "-c", ".storybook-shadcn"],
    {
      cwd: root,
      stdio: "inherit",
    }
  )
)

try {
  await waitForShadcn()

  watch(
    spawn(
      join(root, "node_modules", ".bin", executable("ng")),
      ["run", "material-catalog:storybook", "--port", "6006"],
      {
        cwd: root,
        stdio: "inherit",
      }
    )
  )
} catch (error) {
  console.error(error)
  stop(1)
}
