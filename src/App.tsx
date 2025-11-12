import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// Wstaw tutaj swój URL API Gateway
const API_URL = 'https://nqydeq3mn3.execute-api.eu-central-1.amazonaws.com/prod';

interface OfferRequest {
  userId: string;
  companyName: string;
  topic: string;
  logoUrl?: string;
}

interface OfferResponse {
  message: string;
  offerId: string;
  status: string;
  generatedText: string;
  imageCount: number;
}

function App() {
  const [formData, setFormData] = useState<OfferRequest>({
    userId: '',
    companyName: '',
    topic: '',
    logoUrl: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OfferResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/generate-offer`, formData);
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Wystąpił błąd podczas generowania oferty');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Generator Ofert AI</h1>
        <p>Wygeneruj profesjonalną ofertę biznesową w kilka sekund!</p>
      </header>

      <main className="container">
        <form onSubmit={handleSubmit} className="offer-form">
          <div className="form-group">
            <label htmlFor="userId">Email:</label>
            <input
              type="email"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              required
              placeholder="twoj@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="companyName">Nazwa firmy:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              placeholder="Nazwa Twojej firmy"
            />
          </div>

          <div className="form-group">
            <label htmlFor="topic">Temat oferty:</label>
            <input
              type="text"
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              required
              placeholder="np. Usługi IT, Marketing, Konsulting"
            />
          </div>

          <div className="form-group">
            <label htmlFor="logoUrl">URL logo (opcjonalne):</label>
            <input
              type="url"
              id="logoUrl"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="generate-btn"
          >
            {loading ? '🔄 Generuję...' : '🚀 Wygeneruj Ofertę'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            <h3>❌ Błąd</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-section">
            <h3>✅ Oferta wygenerowana pomyślnie!</h3>
            <div className="result-info">
              <p><strong>ID Oferty:</strong> {result.offerId}</p>
              <p><strong>Status:</strong> {result.status}</p>
            </div>
            
            <div className="generated-content">
              <h4>📄 Wygenerowana treść:</h4>
              <div className="content-preview">
                {result.generatedText}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

