import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import styles from './table.module.scss';

export default function TableSkeleton() {
    const arr = [];
    for (let i = 0; i < 10; i++) {
        arr.push(i);
    }

    return (
        <Container className='container-xl'>
            <Row className={`placeholder-wave align-items-center ${styles.rowHeight}`}>
                <Col xs={12}>
                    <span className="w-100 placeholder placeholder-lg rounded" />
                </Col>
            </Row>
            {
                arr.map(el => (
                    <Row key={el} className={`placeholder-wave align-items-center ${styles.rowHeight}`}>
                        <Col xs={2} md={1} className={styles['first-item']}>
                            <span className='w-100 placeholder placeholder-lg rounded' />
                        </Col>
                        <Col xs={10} md={5}>
                            <span className='w-100 placeholder placeholder-lg rounded' />
                        </Col>
                        <Col xs={3} className='d-none d-md-block'>
                            <span className='w-100 placeholder placeholder-lg rounded' />
                        </Col>
                        <Col xs={3} className='d-none d-md-block'>
                            <span className='w-100 placeholder placeholder-lg rounded' />
                        </Col>
                    </Row>
                ))
            }
        </Container>
    );
}