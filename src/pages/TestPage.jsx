import React from 'react'
import { Container } from 'react-bootstrap'
import { useTranslation } from '../hooks/useTranslation'

const TestPage = () => {
  const t = useTranslation()
  
  return (
    <Container className="py-4">
      <h1>Test Page</h1>
      <p>{t('home')}</p>
      <p>{t('customerReviews')}</p>
      <p>Basic test content</p>
    </Container>
  )
}

export default TestPage