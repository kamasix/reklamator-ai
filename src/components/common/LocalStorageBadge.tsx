import { useEffect, useState } from "react";
import { Database, HardDrive, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDriverInfo, type StorageDriverInfo } from "@/lib/storage/storageDriver";

export function LocalStorageBadge() {
  const [info, setInfo] = useState<StorageDriverInfo | null>(null);

  useEffect(() => {
    let active = true;
    void getDriverInfo()
      .then((value) => {
        if (active) setInfo(value);
      })
      .catch(() => {
        if (active) setInfo({ driver: "unknown", isPersistent: false, label: "Nieznane" });
      });
    return () => {
      active = false;
    };
  }, []);

  if (!info) {
    return (
      <Badge variant="muted" className="gap-1.5">
        <HardDrive className="size-3" />
        <span>Sprawdzanie pamięci…</span>
      </Badge>
    );
  }

  if (!info.isPersistent) {
    return (
      <Badge variant="warning" className="gap-1.5">
        <AlertTriangle className="size-3" />
        <span>Pamięć ulotna ({info.label})</span>
      </Badge>
    );
  }

  return (
    <Badge variant="success" className="gap-1.5">
      <Database className="size-3" />
      <span>Zapis lokalny – {info.label}</span>
    </Badge>
  );
}
