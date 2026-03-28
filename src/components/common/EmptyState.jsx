import { Button } from '@/components/ui/button';

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
          <Icon size={24} className="text-muted-foreground" />
        </div>
      )}
      <h3 className="text-sm font-semibold mb-0.5">{title}</h3>
      {description && <p className="text-xs text-muted-foreground max-w-[240px]">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-3 press-scale rounded-lg text-xs h-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
