"use client";

/**
 * SCR-005 Admin(신고 처리/외부 URL 설정).
 * Admin이 아니면 이 컴포넌트 자체를 렌더링하지 않는다(부모가 role 확인 후 조건부로 마운트).
 * HTTP/javascript/data URL 저장 차단은 src/lib/db/settings.ts의 requireHttpsUrl이 서버에서 강제한다.
 */

import { useEffect, useState } from "react";
import { listReports, updateReportStatus } from "@/lib/db/reports";
import { listOutboundUrlSettings, updateOutboundUrlSetting } from "@/lib/db/settings";
import { useToast } from "@/components/shared/Toast";
import type { MateReport, MateReportStatus, OutboundUrlSetting } from "@/lib/db/types";

const STATUS_LABEL: Record<MateReportStatus, string> = {
  open: "OPEN",
  reviewing: "REVIEWING",
  resolved: "RESOLVED",
  dismissed: "DISMISSED",
};

const STATUS_OPTIONS: MateReportStatus[] = ["open", "reviewing", "resolved", "dismissed"];

export function AdminPanel() {
  const { showToast } = useToast();
  const [reports, setReports] = useState<MateReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<MateReportStatus | "all">("all");
  const [urlSettings, setUrlSettings] = useState<OutboundUrlSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadAll = async () => {
    setLoadError(false);
    setLoading(true);
    try {
      const [reportList, settings] = await Promise.all([listReports(), listOutboundUrlSettings()]);
      setReports(reportList);
      setUrlSettings(settings);
      setUrlInputs(Object.fromEntries(settings.map((s) => [s.id, s.url])));
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadAll();
    })();
  }, []);

  const handleStatusChange = async (reportId: string, status: MateReportStatus) => {
    try {
      await updateReportStatus(reportId, status);
      showToast("신고 상태를 변경했습니다.", "success");
      await loadAll();
    } catch {
      showToast("신고 상태 변경에 실패했습니다.", "danger");
    }
  };

  const handleUrlSave = async (id: OutboundUrlSetting["id"]) => {
    setSavingId(id);
    try {
      const formData = new FormData();
      formData.set("url", urlInputs[id] ?? "");
      await updateOutboundUrlSetting(id, formData);
      showToast("외부 URL 설정을 저장했습니다.", "success");
      await loadAll();
    } catch {
      showToast("HTTPS URL만 저장할 수 있습니다.", "danger");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-sm">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-16 animate-pulse rounded-md bg-bg-strong" />
        ))}
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="rounded-md border border-border-hairline bg-bg-soft p-md text-sm text-text-secondary">
        관리자 데이터를 불러오지 못했습니다.
        <button
          type="button"
          onClick={loadAll}
          className="ml-sm rounded-sm font-semibold text-accent-coral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          다시 시도
        </button>
      </div>
    );
  }

  const filteredReports =
    statusFilter === "all" ? reports : reports.filter((r) => r.status === statusFilter);

  return (
    <div className="flex flex-col gap-lg">
      <section>
        <h2 className="text-lg font-semibold text-text-primary">신고 처리</h2>

        <div className="mt-sm flex flex-wrap gap-xs">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring min-h-[44px] rounded-pill px-md text-sm font-medium ${
              statusFilter === "all"
                ? "bg-accent-coral-soft text-text-primary"
                : "bg-bg-strong text-text-secondary"
            }`}
          >
            전체
          </button>
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring min-h-[44px] rounded-pill px-md text-sm font-medium ${
                statusFilter === status
                  ? "bg-accent-coral-soft text-text-primary"
                  : "bg-bg-strong text-text-secondary"
              }`}
            >
              {STATUS_LABEL[status]}
            </button>
          ))}
        </div>

        {filteredReports.length === 0 ? (
          <p className="mt-sm text-sm text-text-secondary">
            해당 상태의 신고가 없습니다.
          </p>
        ) : (
          <ul className="mt-sm flex flex-col gap-sm">
            {filteredReports.map((report) => (
              <li
                key={report.id}
                className="rounded-md border border-border-hairline bg-bg-soft p-sm text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-sm">
                  <div>
                    <span className="font-semibold text-text-primary">{report.reason_code}</span>
                    <span className="ml-sm text-xs text-text-secondary">
                      신고 번호: {report.id}
                    </span>
                  </div>
                  <select
                    value={report.status}
                    onChange={(e) =>
                      handleStatusChange(report.id, e.target.value as MateReportStatus)
                    }
                    className="min-h-[44px] rounded-sm border border-border-hairline bg-bg-canvas px-sm text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABEL[status]}
                      </option>
                    ))}
                  </select>
                </div>
                {report.description && (
                  <p className="mt-xs text-text-secondary">{report.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-text-primary">외부 URL 허용목록</h2>
        <p className="mt-xs text-sm text-text-secondary">
          항공·숙소 외부 이동 URL은 HTTPS만 저장할 수 있습니다.
        </p>

        <div className="mt-sm flex flex-col gap-sm">
          {urlSettings.map((setting) => (
            <div key={setting.id} className="flex flex-col gap-xs sm:flex-row sm:items-center">
              <label className="text-sm font-semibold text-text-primary sm:w-24">
                {setting.id === "flight" ? "항공" : "숙소"}
              </label>
              <input
                type="url"
                value={urlInputs[setting.id] ?? ""}
                onChange={(e) =>
                  setUrlInputs((prev) => ({ ...prev, [setting.id]: e.target.value }))
                }
                className="min-h-[44px] flex-1 rounded-sm border border-border-hairline bg-bg-canvas px-sm text-sm text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              />
              <button
                type="button"
                onClick={() => handleUrlSave(setting.id)}
                disabled={savingId === setting.id}
                className="min-h-[44px] rounded-pill bg-accent-coral px-md text-sm font-semibold text-bg-canvas hover:bg-accent-coral-active disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                {savingId === setting.id ? "저장하는 중..." : "저장"}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
