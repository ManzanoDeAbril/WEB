<template>
  <div class="page">
    <div class="hero">
      <div class="badge">🚗 Sistema de gestión de flotas</div>

      <h1 class="title">
        Rent<span class="accent">A</span>Car
      </h1>

      <p class="subtitle">
        Administrá tu flota de vehículos, reservas, disponibilidad y costos
        desde un solo lugar.
      </p>

      <div class="actions">
        <NuxtLink to="/login" class="btn-primary">
          Iniciar sesión
        </NuxtLink>
        <NuxtLink to="/register" class="btn-secondary">
          Crear cuenta
        </NuxtLink>
      </div>

      <div class="features">
        <div class="feature">
          <span class="feature-icon">🚗</span>
          <span>Gestión de vehículos</span>
        </div>
        <div class="feature">
          <span class="feature-icon">📋</span>
          <span>Reservas</span>
        </div>
        <div class="feature">
          <span class="feature-icon">🔍</span>
          <span>Disponibilidad</span>
        </div>
        <div class="feature">
          <span class="feature-icon">💰</span>
          <span>Extras & Multas</span>
        </div>
      </div>
    </div>

    <!-- Road strip -->
    <div class="road-strip"><div class="dashes"></div></div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; }

.page {
  min-height: 100vh;
  background: #0f0f1a;
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
}

.hero {
  text-align: center;
  max-width: 600px;
}

.badge {
  display: inline-block;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #f59e0b;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1.5px;
  margin: 0 0 1rem;
}

.accent { color: #f59e0b; }

.subtitle {
  color: rgba(255, 255, 255, 0.45);
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 auto 2rem;
  max-width: 440px;
}

.actions {
  display: flex;
  gap: 0.85rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.8rem;
  border-radius: 10px;
  font-size: 0.92rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s, border-color 0.2s;
}

.btn-primary {
  background: #f59e0b;
  color: #0f0f1a;
}
.btn-primary:hover {
  background: #fbbf24;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.09);
  color: #fff;
  transform: translateY(-1px);
}

/* ── Features ── */
.features {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 1rem 0.5rem;
  font-size: 0.78rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.45);
  transition: border-color 0.2s, transform 0.2s;
}
.feature:hover {
  border-color: rgba(245, 158, 11, 0.3);
  transform: translateY(-2px);
}

.feature-icon { font-size: 1.5rem; }

/* ── Road strip ── */
.road-strip {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 48px;
  background: #1a1a2e;
  border-top: 2px solid #2a2a45;
  overflow: hidden;
}
.dashes {
  position: absolute;
  top: 50%; left: -120px; right: 0;
  height: 4px; margin-top: -2px;
  background: repeating-linear-gradient(
    to right, #f59e0b 0px, #f59e0b 40px, transparent 40px, transparent 80px
  );
  animation: drive 1.4s linear infinite;
}
@keyframes drive {
  from { transform: translateX(0); }
  to   { transform: translateX(80px); }
}

@media (prefers-reduced-motion: reduce) {
  .dashes { animation: none; }
}

@media (max-width: 640px) {
  .title { font-size: 2.5rem; }
  .features { grid-template-columns: repeat(2, 1fr); }
}
</style>