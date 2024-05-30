'use client' // Error components must be Client Components
 
import { useEffect } from 'react'

type ErrorProps = {
    error: Error & { digest?: string },
    reset: () => void
}
export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
    // Log the error to an error reporting service
        console.error('Error page', error.message);
        console.error('Error digest', error.digest);
    }, [error]);
 
    return (
        <div className='w-100 mt-4 d-flex flex-column align-items-center justify-content-center' style={{ height: '35vh' }}>
            <p className='text-danger fs-2'>An error has occured!</p>
            { error.message && <p className='text-danger fs-4'>{error.message}</p> }
            <p className='text-danger fs-4'>Please try again later.</p>
            <button className='mt-4 btn btn-warning'
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
        </div>
    )
}