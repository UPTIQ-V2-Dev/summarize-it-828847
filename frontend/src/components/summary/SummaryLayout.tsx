interface SummaryLayoutProps {
    children: React.ReactNode;
}

export const SummaryLayout = ({ children }: SummaryLayoutProps) => {
    return (
        <div className='container mx-auto px-4 py-8'>
            <div className='max-w-7xl mx-auto'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>{children}</div>
            </div>
        </div>
    );
};
