export default function CoinViewError({ error }: { error: string }) {
    return (
        <div style={{ minHeight: '200px' }} className="w-100 mt-3 d-flex flex-column align-items-center justify-content-center">
            <p className="text-danger fs-2">The following error has occured:</p>
            <p className="text-danger fs-4 text-center">{error}</p>
            <p className="text-danger fs-4 pt-2">Please try again later</p>
        </div>
    )
}