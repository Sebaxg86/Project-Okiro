"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteActivityAction } from "./actions";
import type { ActivityKind } from "./schemas";

export function ActivityActions({ kind, id, idempotencyKey }: { kind: ActivityKind; id: string; idempotencyKey: string }) {
  const deleteAction = deleteActivityAction.bind(null, kind, id);
  return (
    <div className="flex items-center gap-1">
      <Link href={`/app/log?type=${kind}&id=${id}`} className="grid size-9 place-items-center rounded-xl text-muted hover:bg-white/[0.04] hover:text-cyan" aria-label="Editar registro"><Pencil size={15} /></Link>
      <form action={deleteAction} onSubmit={(event) => { if (!window.confirm("¿Eliminar este registro? El balance de XP se actualizará automáticamente.")) event.preventDefault(); }}>
        <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
        <button type="submit" className="grid size-9 place-items-center rounded-xl text-muted hover:bg-warning/[0.07] hover:text-warning" aria-label="Eliminar registro"><Trash2 size={15} /></button>
      </form>
    </div>
  );
}
