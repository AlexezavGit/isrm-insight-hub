import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useDismissibleDetails } from "./useDismissibleDetails";
import type { ClientLocale } from "@/lib/client-catalog";

export function BriefingNextSteps({ locale, reducedMotion }: { locale: ClientLocale; reducedMotion: boolean }) {
  const uk = locale === "uk";
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const proposalHint = useDismissibleDetails();
  useEffect(() => {
    if (reducedMotion || paused) return;
    const timer = window.setInterval(() => setActive(i => (i + 1) % 4), 1800);
    return () => window.clearInterval(timer);
  }, [reducedMotion, paused]);
  const labels = uk
    ? ["Переглянути граф", "Спробувати застосунок", "Погодити обсяг і бюджет", "Отримати пропозицію"]
    : ["Explore the graph", "Try the application", "Agree scope & budget", "Receive a proposal"];
  return <figure className="briefing-visual briefing-next-graph" aria-label={uk ? "Чотири наступні кроки" : "Four next steps"}>
    <ol className="briefing-runway" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}>
      {labels.map((label, i) => <li key={label} className={active === i ? "is-lit" : ""}>
        {i < 3 ? <Link className="briefing-step-tab" to={i === 2 ? "/scope" : "/"} {...(i === 2 ? {} : { search: i === 1 ? { panel: "search" as const } : { view: "map" as const } })} onClick={() => setActive(i)}>
          <span className="briefing-step-number">0{i + 1}</span><strong>{label}</strong>
        </Link> : <details ref={proposalHint} className="briefing-proposal-step" onToggle={e => { if (e.currentTarget.open) { setActive(3); setPaused(true); } }}>
          <summary className="briefing-step-tab"><span className="briefing-step-number">04</span><strong>{label}</strong></summary>
          <div className="briefing-proposal-hint"><p>{uk ? "Після вашого вибору й уточнення потреб ми підготуємо детальну пропозицію з обсягом, етапами та бюджетом. Ви зможете переглянути погодження перед відповіддю." : "Following your selection and clarification of requirements, we will prepare a detailed proposal setting out the scope, stages and budget. You can review your choices before responding."}</p><Link to="/scope">{uk ? "Повернутися до погодження" : "Return to scope agreement"}</Link></div>
        </details>}
      </li>)}
    </ol>
  </figure>;
}
