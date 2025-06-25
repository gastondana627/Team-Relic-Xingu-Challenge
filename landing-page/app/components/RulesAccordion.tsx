interface RulesAccordionProps {
    title: string;
    children: React.ReactNode;
}

export default function RulesAccordion({ title, children }: RulesAccordionProps) {
    return (
        <details className="accordion">
            <summary>{title}</summary>
            <div className="accordion-content">
                {children}
            </div>
        </details>
    );
}