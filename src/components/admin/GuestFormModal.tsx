import { useState } from "react";
import type { NuevoGrupoInput } from "@/hooks/useGuestsAdmin";
import type { CategoriaInvitado, GrupoInvitacion, NivelImportancia } from "@/types/domain";

interface GuestFormModalProps {
  grupoInicial: GrupoInvitacion | null;
  onCancelar: () => void;
  onGuardar: (input: NuevoGrupoInput) => Promise<void>;
}

const CATEGORIAS: CategoriaInvitado[] = [
  "familia_novia",
  "familia_novio",
  "amigos_novia",
  "amigos_novio",
  "trabajo",
  "otros",
];

const IMPORTANCIAS: NivelImportancia[] = ["principal", "estandar", "cortesia"];

export function GuestFormModal({ grupoInicial, onCancelar, onGuardar }: GuestFormModalProps) {
  const [form, setForm] = useState<NuevoGrupoInput>({
    nombre_grupo: grupoInicial?.nombre_grupo ?? "",
    invitado_principal: grupoInicial?.invitado_principal ?? "",
    limite_personas: grupoInicial?.limite_personas ?? 1,
    categoria: grupoInicial?.categoria ?? "otros",
    importancia: grupoInicial?.importancia ?? "estandar",
  });
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit() {
    setGuardando(true);
    await onGuardar(form);
    setGuardando(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="font-display text-xl text-olive-900">
          {grupoInicial ? "Editar grupo" : "Nuevo grupo de invitación"}
        </h2>

        <div className="mt-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-neutral-500">Nombre del grupo</label>
            <input
              value={form.nombre_grupo}
              onChange={(e) => setForm({ ...form, nombre_grupo: e.target.value })}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500">Invitado principal</label>
            <input
              value={form.invitado_principal}
              onChange={(e) => setForm({ ...form, invitado_principal: e.target.value })}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500">Límite de personas</label>
            <input
              type="number"
              min={1}
              value={form.limite_personas}
              onChange={(e) => setForm({ ...form, limite_personas: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-500">Categoría</label>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value as CategoriaInvitado })}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500">Importancia</label>
              <select
                value={form.importancia}
                onChange={(e) => setForm({ ...form, importancia: e.target.value as NivelImportancia })}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
              >
                {IMPORTANCIAS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancelar} className="rounded-lg px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-100">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={guardando || !form.nombre_grupo || !form.invitado_principal}
            className="rounded-lg bg-olive px-4 py-2 text-sm text-white hover:bg-olive-900 disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
