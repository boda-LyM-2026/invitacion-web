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
import { ETIQUETAS_CATEGORIA } from "@/config/catalogos";
import { buildSerieTiempo } from "@/lib/stats";
import type { GrupoInvitacion } from "@/types/domain";

const COLORES_ESTADO: Record<string, string> = {
  Confirmado: "#828661",
  Pendiente: "#E7DBCB",
  Rechazado: "#4B523C",
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
      <div className="rounded-2xl border border-pistachio-200/50 bg-white p-5 shadow-soft">
        <h3 className="mb-4 font-display text-lg font-light italic text-olive-900">
          Grupos por categoría
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={porCategoria}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E8DD" />
            <XAxis
              dataKey="categoria"
              tick={{ fontSize: 11, fill: "#6b6b6b" }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b6b6b" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E6E8DD",
                borderRadius: "12px",
                color: "#1a1a1a",
              }}
            />
            <Bar dataKey="grupos" fill="#828661" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-pistachio-200/50 bg-white p-5 shadow-soft">
        <h3 className="mb-4 font-display text-lg font-light italic text-olive-900">
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
              wrapperStyle={{ color: "#6b6b6b", fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E6E8DD",
                borderRadius: "12px",
                color: "#1a1a1a",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl border border-pistachio-200/50 bg-white p-5 shadow-soft lg:col-span-2">
        <h3 className="mb-4 font-display text-lg font-light italic text-olive-900">
          Confirmaciones en el tiempo
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={serieTiempo}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6E8DD" />
            <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#6b6b6b" }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#6b6b6b" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #E6E8DD",
                borderRadius: "12px",
                color: "#1a1a1a",
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
