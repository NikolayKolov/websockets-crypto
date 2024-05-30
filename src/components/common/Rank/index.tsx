import styles from './rank.module.scss';

export default function Rank({ rankNumber }: { rankNumber: string }) {

    return (
        <div className={`${styles.rankContainer} bg-primary ms-2 px-2 pt-3 pb-1 text-center rounded-bottom`}>
            <h1 className='fs-4'>
                {rankNumber}
            </h1>
            <p>Rank</p>
        </div>
    );
}