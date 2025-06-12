import React from 'react';

const ContactsPage = () => {
  return (
    <div className="container">
      <h1 className="page-title">Контакты</h1>
      
      <div className="contacts-grid">
        <div className="contact-info">
          <h2>Наши контакты</h2>
          <div className="contact-details">
            <p><strong>Адрес:</strong> г. Казань, ул. Баумана, 82</p>
            <p><strong>Телефон:</strong> +7 (999) 123-45-67</p>
            <p><strong>Email:</strong> info@moreandmore.ru</p>
            <p><strong>Режим работы:</strong></p>
            <p>Пн-Пт: 10:00 - 20:00</p>
            <p>Сб-Вс: 11:00 - 19:00</p>
          </div>
        </div>

        <div className="contact-form">
          <h2>Напишите нам</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Ваше имя</label>
              <input type="text" id="name" name="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="message">Сообщение</label>
              <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Отправить</button>
          </form>
        </div>
      </div>

      <div className="map-container">
        <h2>Как нас найти</h2>
        <div className="map">
          {/* Здесь будет карта */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.772185477012!2d49.1067!3d55.7907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x415ead1f3c1c1b1f%3A0x1c3c3c3c3c3c3c3c!2z0YPQuy4g0JHQsNC80LDRgNCwLCDQmtCw0LfQsNC90YwsINCg0LXRgdC_LiDQotCw0YLQsNGA0YHRgtCw0L0!5e0!3m2!1sru!2sru!4v1620000000000!5m2!1sru!2sru" 
            width="100%" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            title="Карта"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactsPage; 