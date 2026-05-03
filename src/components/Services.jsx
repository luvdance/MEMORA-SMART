import img1 from "../assets/web dev image.png";
import img2 from "../assets/Ai biz.png";
import img3 from "../assets/tech skills.png";
import img4 from "../assets/book cover.JPG";
import { useEffect } from "react";

function Services() {
useEffect(() => {
    const images = document.querySelectorAll(".service-img");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 } // triggers when 20% visible
    );

    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="services">

      {/* SERVICE 1 */}
      <div className="service-row">
        <div className="service-text">
          <h2>Easily Build Web Projects</h2>
          <p>
            We help you design and develop modern, scalable websites tailored to your business needs.
            From simple landing pages to full web applications, we turn your ideas into powerful digital products.
          </p>
          <a href="#" className="service-btn">Get Started</a>
        </div>

        <div className="service-img">
          <img src={img1} alt="Web Development" />
        </div>
      </div>

      {/* SERVICE 2 (REVERSED) */}
      <div className="service-row reverse">
        <div className="service-text">
          <h2>Grow Your Business Digitally</h2>
          <p>
            Our digital marketing strategies help you reach the right audience, increase visibility,
            and drive real engagement that converts into sales.
          </p>
          <a href="#" className="service-btn">Learn More</a>
        </div>

        <div className="service-img">
          <img src={img2} alt="Digital Marketing" />
        </div>
      </div>

      {/* SERVICE 3 */}
      <div className="service-row">
        <div className="service-text">
          <h2>Download our Functional Training Manuals</h2>
          <p>
            Gain access to structured, practical resources designed to build real-world 
            tech skills and accelerate your learning journey.
          </p>
          <a href="#" className="service-btn">Start Learning</a>
        </div>

        <div className="service-img">
          <img src={img3} />
        </div>
      </div>

      {/* SERVICE 4 (REVERSED) */}
      <div className="service-row reverse">
        <div className="service-text">
          <h2>Grow Your Business Digitally</h2>
          <p>
            Our digital marketing strategies help you reach the right audience, increase visibility,
            and drive real engagement that converts into sales.
          </p>
          <a href="#" className="service-btn">Learn More</a>
        </div>

        <div className="service-img">
          <img src={img4} alt="Digital Marketing" />
        </div>
      </div>

    </section>
  );
}

export default Services;