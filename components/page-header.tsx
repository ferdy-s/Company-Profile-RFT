type PageHeaderProps = {
  title: string;
  description: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="border-b border-border/40 bg-card/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
      </div>
    </div>
  );
}
