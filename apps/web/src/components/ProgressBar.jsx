export default function ProgressBar({ percent, label, showLabel = true, }) {
    const clampedPercent = Math.min(Math.max(percent, 0), 100);
    return (<div className="w-full">
      {label && showLabel && (<div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm font-semibold text-blue-600">
            {clampedPercent}%
          </span>
        </div>)}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300 ease-out" style={{ width: `${clampedPercent}%` }}/>
      </div>
    </div>);
}
