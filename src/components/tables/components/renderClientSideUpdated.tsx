'use client';

import { CellContext } from '@tanstack/react-table';
import Badge from 'react-bootstrap/Badge';

export default function renderClientSideUpdated(info: CellContext<any, any>) {
    const lastUpdateMsAgo = Date.now() - info.getValue();
    const seconds = lastUpdateMsAgo / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    let updatedLabel = 'Less than a minute ago';
    if (minutes > 1) updatedLabel = `${Math.floor(minutes).toFixed()} minutes(s) ago`;
    if (hours > 1) updatedLabel = `${Math.floor(hours).toFixed()} hour(s) ago`;
    if (days > 1) updatedLabel = `${Math.floor(days).toFixed()} day(s) ago`;

    let textColor = 'success';
    if (minutes > 5) textColor = 'warning';
    if (hours > 1) textColor = 'danger';

    return (
        <div className='text-end me-4' suppressHydrationWarning>
            <Badge pill bg={textColor} title={updatedLabel}>&nbsp;</Badge>
        </div>
    );
}