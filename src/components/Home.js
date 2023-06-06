import { useState, useEffect } from 'react';
import styles from './Home.module.scss';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [submittedValue, setSubmittedValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedValue(inputValue);
    setInputValue('');
  };

  useEffect(() => {
    if (!submittedValue) return;
    const {origin} = window.document.location;
    const devUrl = `${origin}/?id=${submittedValue}`;
    window.location.href = devUrl;
  }, [submittedValue])
  

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a company id"
          className={styles.inputText}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Home;
