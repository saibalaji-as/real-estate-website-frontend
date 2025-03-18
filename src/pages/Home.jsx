import "../styles/global.css";

const Home = () => {
    return (
        <>
            <div className="wallpaper">
                <marquee className="marque-txt" behavior="scroll" direction="left" scrollamount="5">"Your Dream Home Awaits, Find Your Perfect Place, Invest in Your Future"</marquee>
            </div>

            <div>
                <div class="max-w-6xl mx-auto p-6">
                    <header class="text-center py-10">
                        <h1 class="text-4xl font-extrabold text-blue-600">Welcome to Sai Real Estates</h1>
                        <p class="text-lg text-gray-600 mt-2">Your Trusted Partner in Property Solutions</p>
                    </header>

                    <section class="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 class="text-2xl font-semibold text-blue-500 mb-4">Why Choose Sai Real Estates?</h2>
                        <p class="text-gray-700">At <strong>Sai Real Estates</strong>, we believe in integrity, transparency, and excellence. Our team of experienced professionals provides top-notch service with expert guidance and market insights.</p>
                    </section>

                    <section class="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 class="text-2xl font-semibold text-blue-500 mb-4">Diverse Range of Properties</h2>
                        <p class="text-gray-700">From budget-friendly homes to luxury villas, we offer a wide selection of residential and commercial properties to suit every need.</p>
                    </section>

                    <section class="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 class="text-2xl font-semibold text-blue-500 mb-4">Simplified Buying and Selling Process</h2>
                        <p class="text-gray-700">We handle everything from property valuation and legal documentation to negotiations, ensuring a seamless experience.</p>
                    </section>

                    <section class="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 class="text-2xl font-semibold text-blue-500 mb-4">Investment Opportunities</h2>
                        <p class="text-gray-700">Invest wisely with our expert guidance on high-potential properties, ensuring long-term returns.</p>
                    </section>

                    <section class="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 class="text-2xl font-semibold text-blue-500 mb-4">Personalized Customer Service</h2>
                        <p class="text-gray-700">We offer tailored solutions based on your unique preferences, whether you’re a first-time buyer or a seasoned investor.</p>
                    </section>

                    <section class="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 class="text-2xl font-semibold text-blue-500 mb-4">Technology-Driven Approach</h2>
                        <p class="text-gray-700">We leverage virtual tours, online listings, and data analytics to simplify your real estate experience.</p>
                    </section>

                    <section class="bg-white shadow-lg rounded-lg p-6 mb-6">
                        <h2 class="text-2xl font-semibold text-blue-500 mb-4">Building Long-Term Relationships</h2>
                        <p class="text-gray-700">Our commitment to excellence ensures that clients trust us for their future real estate needs.</p>
                    </section>

                    <footer class="text-center py-10">
                        <h2 class="text-2xl font-bold text-blue-600">Contact Us Today</h2>
                        <p class="text-gray-700 mt-2">Let <strong>Sai Real Estates</strong> help you find your dream property.</p>
                        <button class="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">Get in Touch</button>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Home;
