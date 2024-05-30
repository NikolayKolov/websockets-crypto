export default function RowDetail({ title, value }: { title: string, value: string }) {
    return (
        <>
            <div style={{ fontSize: '12px' }}>{title}</div>
            <div className='text-capitalize fs-3 fw-bold'>
                {value}
            </div>
        </>
    )
}