import { motion } from "framer-motion";
import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

const Contact = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 pt-32"
        >
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-8 text-4xl font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h1>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium uppercase tracking-wider text-white/60"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-0"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium uppercase tracking-wider text-white/60"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-0"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium uppercase tracking-wider text-white/60"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  className="mt-1 block w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-white/20 focus:outline-none focus:ring-0"
                  placeholder="Your message"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-white px-8 py-4 text-center text-sm font-medium uppercase tracking-wider text-black transition-colors hover:bg-white/90"
              >
                Send Message
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Contact;
