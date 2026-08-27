import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GrupoInvitacion } from "@/types/domain";

const COLORES_ESTADO: Record<string, string> = {
  Confirmado: "#828661",
  Pendiente: "#E7DBCB",
  Rechazado: "#4B523C",
};

const ETIQUETAS_CATEGORIA: Record<string, string> = {
  familia_novia: "Familia novia",
  familia_novio: "Familia novio",
  amigos_novia: "Amigos novia",
  amigos_novio: "Amigos novio",
  trabajo: "Trabajo",
  otros: "Otros",
};

interface DashboardChartsProps {
  grupos: GrupoInvitacion[];
}

export function DashboardCharts({ grupos }: DashboardChartsProps) {
  const porCategoria = Object.entries(ETIQUETAS_CATEGORIA).map(([key, label]) => ({
    categoria: label,
    grupos: grupos.filter((g) => g.categoria === key).length,
  }));

  const porEstado = [
    { name: "Confirmado", value: grupos.filter((g) => g.estado === "confirmed").length },
    { name: "Pendiente", value: grupos.filter((g) => g.estado === "pending").length },
    { name: "Rechazado", value: grupos.filter((g) => g.estado === "declined").length },
  ];

  const serieTiempo = buildSerieTiempo(grupos);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-alabaster/10 bg-alabaster/5 p-5 backdrop-blur-sm">
        <h3 className="mb-4 font-display text-lg font-light italic text-alabaster">
          Grupos por categoría
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={porCategoria}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(249,249,239,0.1)" />
            <XAxis
              dataKey="categoria"
              tick={{ fontSize: 11, fill: "rgba(249,249,239,0.5)" }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "rgba(249,249,239,0.5)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(26,26,26,0.9)",
                border: "1px solid rgba(249,249,239,0.1)",
                borderRadius: "12px",
                color: "#F9F9EF",
              }}
            />
            <Bar dataKey="grupos" fill="#828661" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-alabaster/10 bg-alabaster/5 p-5 backdrop-blur-sm">
        <h3 className="mb-4 font-display text-lg font-light italic text-alabaster">
          Distribución de estados
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={porEstado}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
            >
              {porEstado.map((entry) => (
                <Cell key={entry.name} fill={COLORES_ESTADO[entry.name]} />
              ))}
            </Pie>
            <Legend
              wrapperStyle={{ color: "rgba(249,249,239,0.7)", fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(26,26,26,0.9)",
                border: "1px solid rgba(249,249,239,0.1)",
                borderRadius: "12px",
                color: "#F9F9EF",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-alabaster/10 bg-alabaster/5 p-5 backdrop-blur-sm lg:col-span-2">
        <h3 className="mb-4 font-display text-lg font-light italic text-alabaster">
          Confirmaciones en el tiempo
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={serieTiempo}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(249,249,239,0.1)" />
            <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "rgba(249,249,239,0.5)" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "rgba(249,249,239,0.5)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(26,26,26,0.9)",
                border: "1px solid rgba(249,249,239,0.1)",
                borderRadius: "12px",
                color: "#F9F9EF",
              }}
            />
            <Line
              type="monotone"
              dataKey="acumulado"
              stroke="#828661"
              strokeWidth={2}
              dot={{ fill: "#828661", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#E7DBCB" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function buildSerieTiempo(grupos: GrupoInvitacion[]) {
  const confirmados = grupos
    .filter((g) => g.estado === "confirmed" && g.respondido_en)
    .map((g) => g.respondido_en as string)
    .sort();

  const porDia = new Map<string, number>();
  confirmados.forEach((iso) => {
    const dia = iso.slice(0, 10);
    porDia.set(dia, (porDia.get(dia) ?? 0) + 1);
  });

  let acumulado = 0;
  return Array.from(porDia.entries()).map(([fecha, cantidad]) => {
    acumulado += cantidad;
    return { fecha, acumulado };
  });
}
