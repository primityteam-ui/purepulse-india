export default function TrustBadges() {
  const badges = ['FSSAI', 'USDA Organic', 'EU Organic', 'Lab Tested']

  return (
    <div className="flex flex-wrap gap-3">
      {badges.map((badge) => (
        <span
          key={badge}
          className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-extrabold text-white/80"
        >
          {badge}
        </span>
      ))}
    </div>
  )
}