import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center", backgroundColor: "var(--color-fondo)" }}>
      <header style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Image
          src="/img/logo.svg"
          alt="Logo de Cortes Relativos con ilustración inspirada en Einstein y elementos de peluquería"
          width={280}
          height={280}
          priority
          style={{ width: "240px", height: "auto", marginBottom: "1.5rem" }}
        />
        <h1 style={{ fontSize: "2.8rem", color: "var(--color-principal)", marginBottom: "0.5rem" }}>
          Tu estilo, relativamente perfecto
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--color-principal)", maxWidth: "560px", lineHeight: "1.6" }}>
          Peluquería en Tinogasta, Catamarca. Consultá disponibilidad, servicios y reservá tu turno en pocos pasos.
        </p>
      </header>

      <section style={{ marginTop: "1rem" }}>
        <Link
          href="/turnos"
          style={{
            display: "inline-block",
            backgroundColor: "var(--color-acento)",
            color: "var(--color-principal)",
            padding: "0.9rem 2.2rem",
            fontSize: "1.15rem",
            fontWeight: "600",
            borderRadius: "var(--radio-borde)",
            boxShadow: "0 4px 12px rgba(44, 62, 80, 0.12)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease"
          }}
        >
          Reservar turno
        </Link>
      </section>
    </main>
  );
}
