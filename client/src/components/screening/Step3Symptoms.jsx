import { useTranslation } from 'react-i18next';

export default function Step3Symptoms({ data, onChange }) {
  const { t } = useTranslation();

  const symptoms = [
    {
      key: 'urination',
      label: t('frequent_urination'),
      icon: '🚽'
    },
    {
      key: 'thirst',
      label: t('excessive_thirst'),
      icon: '💧'
    },
    {
      key: 'vision',
      label: t('blurred_vision'),
      icon: '👁️'
    },
    {
      key: 'headache',
      label: t('headache'),
      icon: '🤕'
    },
    {
      key: 'fatigue',
      label: t('fatigue'),
      icon: '😴'
    },
    {
      key: 'numbness',
      label: t('numbness'),
      icon: '🖐️'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">

        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl shadow-sm border border-blue-100">
          🔍
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
            {t('symptom_check', 'Symptom Check')}
          </h2>

          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {t(
              'symptom_subtitle',
              'Select Yes or No for reported symptoms'
            )}
          </p>
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-3">

        {symptoms.map((s) => {
          const isYes = data[s.key] === true;
          const isNo = data[s.key] === false;

          let cardStyle =
            'bg-white border-slate-200 hover:border-slate-300';

          let textStyle = 'text-slate-700';

          let iconBg = 'bg-slate-50 border-slate-100';

          if (isYes) {
            cardStyle =
              'bg-rose-50/50 border-rose-200 shadow-sm';

            textStyle = 'text-rose-900';

            iconBg = 'bg-rose-100 border-rose-200';

          } else if (isNo) {
            cardStyle =
              'bg-emerald-50/50 border-emerald-200 shadow-sm';

            textStyle = 'text-emerald-900';

            iconBg = 'bg-emerald-100 border-emerald-200';
          }

          return (
            <div
              key={s.key}
              className={`p-3 sm:p-4 rounded-[1.25rem] border transition-all duration-300 flex items-center justify-between gap-3 ${cardStyle}`}
            >

              {/* Left */}
              <div className="flex items-center gap-3 md:gap-4">

                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border transition-colors duration-300 ${iconBg}`}
                >
                  {s.icon}
                </div>

                <span
                  className={`font-bold text-sm sm:text-base transition-colors duration-300 ${textStyle}`}
                >
                  {s.label}
                </span>
              </div>

              {/* Right Buttons */}
              <div className="flex gap-2 shrink-0 bg-slate-100/50 p-1 rounded-[1.25rem] border border-slate-100">

                {/* YES */}
                <button
                  type="button"
                  onClick={() => onChange({ [s.key]: true })}
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
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
                  className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95 ${
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