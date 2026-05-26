import { useTranslation } from 'react-i18next';

export default function Step5Ayurveda({ data, onChange }) {
  const { t } = useTranslation();

  /**
   * Ayurvedic symptom labels sourced from:
   * Charaka Samhita Nidanasthana 4/47 and
   * Ashtanga Hridaya Nidanasthana 10/7-8
   * (Purvarupa — premonitory symptoms of Prameha/Madhumeha)
   */
  const ayurvedicSymptoms = [
    {
      key: 'urinaryAbnormalities',
      label: 'Excessive, turbid, or frequent urination',
      icon: '🚽',
      sanskrit: 'Prabhuta Mutrata / Prameha (Charaka Nidana 4/6)'
    },
    {
      key: 'frequentThirst',
      label: 'Persistent, unquenchable thirst and dry mouth',
      icon: '💧',
      sanskrit: 'Trishna / Mukha-Talu-Kantha Shosha (Charaka Nidana 4/47)'
    },
    {
      key: 'bodyHeat',
      label: 'Burning sensation in palms and soles of feet',
      icon: '🔥',
      sanskrit: 'Kara-Pada Daha (Charaka Nidana 4/47) — Purvarupa of Prameha'
    },
    {
      key: 'skinDryness',
      label: 'Stickiness or excessive oiliness of skin',
      icon: '🖐️',
      sanskrit: 'Anga Upadeha / Snigdhata (Charaka Nidana 4/47)'
    },
    {
      key: 'fatigue',
      label: 'Unexplained fatigue and heaviness in the body',
      icon: '😴',
      sanskrit: 'Daurbalya / Anga Shaithilya (Charaka Nidana 4/47)'
    },
    {
      key: 'digestiveIssues',
      label: 'Digestive weakness, bloating, or irregular appetite',
      icon: '🫁',
      sanskrit: 'Agnimandya (impaired digestive fire) — key Kapha indicator'
    },
    {
      key: 'sleepDisturbances',
      label: 'Excessive desire to lie down, drowsiness, or sleep disturbance',
      icon: '🌙',
      sanskrit: 'Alasya / Tandra (Charaka Nidana 4) — sedentary habit, primary Nidana of Prameha'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">

        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-sm border border-emerald-100">
          🌿
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            {t('ayurvedic_assessment', 'Ayurvedic Assessment')}
          </h2>

          <p className="text-sm text-gray-500">
            Classical premonitory symptoms (Purvarupa) of Prameha — sourced from Charaka Samhita Nidanasthana 4/47 and Ashtanga Hridaya Nidanasthana 10/7–8. These signs appear before blood tests show abnormality.
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-[1.25rem] p-4 flex items-start gap-3 shadow-sm">

        <div className="text-emerald-500 text-lg mt-0.5">
          📌
        </div>

        <p className="text-sm text-emerald-800 font-medium leading-relaxed">
          {t(
            'ayurveda_info',
            'These Ayurvedic indicators help identify early-stage metabolic risk before clinical symptoms appear.'
          )}
        </p>
      </div>

      {/* Symptom List */}
      <div className="space-y-3 sm:space-y-4">

        {ayurvedicSymptoms.map((s) => {
          const isYes = data[s.key] === true;
          const isNo = data[s.key] === false;

          let cardStyle =
            'bg-white border-slate-200 hover:border-slate-300';

          let textStyle = 'text-slate-700';

          let sanskritStyle = 'text-slate-400';

          let iconBg = 'bg-slate-50 border-slate-100';

          if (isYes) {
            cardStyle =
              'bg-rose-50/50 border-rose-200 shadow-sm';

            textStyle = 'text-rose-900';

            sanskritStyle = 'text-rose-600/70';

            iconBg = 'bg-rose-100 border-rose-200';

          } else if (isNo) {
            cardStyle =
              'bg-emerald-50/50 border-emerald-200 shadow-sm';

            textStyle = 'text-emerald-900';

            sanskritStyle = 'text-emerald-600/70';

            iconBg = 'bg-emerald-100 border-emerald-200';
          }

          return (
            <div
              key={s.key}
              className={`p-3 sm:p-4 rounded-[1.25rem] border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${cardStyle}`}
            >

              {/* Left Side */}
              <div className="flex items-center gap-3 md:gap-4 w-full">

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-colors duration-300 shrink-0 ${iconBg}`}
                >
                  {s.icon}
                </div>

                <div className="flex-1">

                  <p
                    className={`font-bold text-sm sm:text-base transition-colors duration-300 leading-tight ${textStyle}`}
                  >
                    {s.label}
                  </p>

                  <p
                    className={`text-xs italic font-medium mt-1 transition-colors duration-300 ${sanskritStyle}`}
                  >
                    {s.sanskrit}
                  </p>

                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 w-full sm:w-auto shrink-0 bg-slate-100/50 p-1 rounded-[1.25rem] border border-slate-100">

                {/* YES */}
                <button
                  type="button"
                  onClick={() => onChange({ [s.key]: true })}
                  className={`flex-1 sm:flex-none px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
                    isYes
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-200 border border-rose-600'
                      : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
                  }`}
                >
                  {t('yes')}
                </button>

                {/* NO */}
                <button
                  type="button"
                  onClick={() => onChange({ [s.key]: false })}
                  className={`flex-1 sm:flex-none px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
                    isNo
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200 border border-emerald-600'
                      : 'bg-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
                  }`}
                >
                  {t('no')}
                </button>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}