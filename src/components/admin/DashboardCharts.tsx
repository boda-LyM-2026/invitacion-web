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
import type { KpiGraficos } from "@/types/domain";

const COLORES_ESTADO: Record<string, string> = {
  confirmed: "#828661",
  pending: "#E7DBCB",
  declined: "#4B523C",
};

const ETIQUETAS_ESTADO_GRAFICO: Record<string, string> = {
  confirmed: "Confirmado",
  pending: "Pendiente",
  declined: "Rechazado",
};

const COLORES_CATEGORIA = ["#828661", "#969D7B", "#B5B79F", "#CDC6B5", "#7D8465", "#A8AD9A"];

interface DashboardChartsProps {
  charts: KpiGraficos | null;
}

/**
 * Gráficos del panel. Reciben los agregados ya calculados en el servidor
 * (RPC `kpi_graficos`): el navegador no descarga a todos los invitados
 * solo para dibujar. Si `charts` es null (sin datos todavía) no dibuja nada.
 */
export function DashboardCharts({ charts }: DashboardChartsProps) {
  if (!charts) return null;

  const porCategoria = charts.por_categoria.map((c) => ({
    categoria: ETIQUETAS_CATEGORIA[c.categoria] ?? c.categoria,
    grupos: c.grupos,
  }));

  const porEstado = charts.por_estado.map((e) => ({
    name: ETIQUETAS_ESTADO_GRAFICO[e.estado] ?? e.estado,
    value: e.grupos,
  }));

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
            <Bar dataKey="grupos" radius={[6, 6, 0, 0]}>
              {porCategoria.map((c, i) => (
                <Cell key={c.categoria} fill={COLORES_CATEGORIA[i % COLORES_CATEGORIA.length]} />
              ))}
            </Bar>
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
            <Legend wrapperStyle={{ color: "#6b6b6b", fontSize: "12px" }} />
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
          <LineChart data={charts.serie_tiempo}>
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