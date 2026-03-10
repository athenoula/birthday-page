export default function Toggle({ value, onChange, label, accent }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold">
      <div onClick={() => onChange(!value)} className="relative w-[38px] h-[22px] rounded-full shrink-0 cursor-pointer transition-colors duration-200" style={{
        background: value ? (accent || "#4d96ff") : "#ddd",
      }}>
        <div className="absolute top-[3px] w-4 h-4 rounded-full bg-white transition-[left] duration-200 shadow-sm" style={{
          left: value ? 19 : 3,
        }}/>
      </div>
      {label}
    </label>
  )
}
