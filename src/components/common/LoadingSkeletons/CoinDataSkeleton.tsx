import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';

import styles from './coinDataSkeleton.module.scss';

export default function CoinDataSkeleton() {
    return (
        <Container fluid className='container-xl placeholder-wave'>
            <Row className='p-3'>
                <Col xs={12} md={4} className={`${styles.justifyCoinCenter} d-flex align-items-center mb-4 mb-md-0`}>
                    <div className="w-100 placeholder placeholder-lg rounded" style={{height: '52px', marginTop: '4px'}}/>
                    <Stack gap={2} className='flex-grow-0'>
                        <span className="w-100 placeholder placeholder-lg rounded" />
                        <span className="w-100 placeholder placeholder-lg rounded" />
                    </Stack>
                </Col>
                <Col xs={6} md={4}>
                    <Stack gap={2} className={styles.firstColumn}>
                        <div className='text-uppercase'>
                            <span className="w-100 placeholder placeholder-lg rounded" />
                        </div>
                        <div className='text-uppercase'>
                            <span className="w-100 placeholder placeholder-lg rounded" />
                        </div>
                    </Stack>
                </Col>
                <Col xs={6} md={4}>
                    <Stack gap={2} className={styles.firstColumn}>
                        <div className='text-uppercase'>
                            <span className="w-100 placeholder placeholder-lg rounded" />
                        </div>
                        <div className='text-uppercase'>
                            <span className="w-100 placeholder placeholder-lg rounded" />
                        </div>
                    </Stack>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <div className="w-100 placeholder placeholder-lg rounded" style={{minHeight: '300px', aspectRatio: 2/1 }} />
                </Col>
            </Row>
        </Container>
    )
}