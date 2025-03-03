import { useEffect, useRef, useState } from "react";
import { Twitter, Close, GitHub, LinkedIn } from "@mui/icons-material";
import { contact } from "../assets";
import { motion } from "framer-motion";
import validator from "email-validator";
import { Heading } from "../components";
import { Link } from "react-router-dom/dist";
import axios from "axios";
import { BACKEND_BASE_URL } from "../constant";

const Contact = ({ setOpenOTPModal, setOtpFormType }) => {
  /////////////////////////////////////// VARIABLES /////////////////////////////////////////////
  const initialState = { name: "", email: "", message: "", subject: "" };
  const sectionRef = useRef();

  /////////////////////////////////////// STATES /////////////////////////////////////////////
  const [contactData, setContactData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState(initialState);
  const validated =
    validationMessage.name == "" &&
    validationMessage.email == "" &&
    validationMessage.message == "" &&
    validationMessage.subject == "";

  //////////////////////////////////////// USE EFFECT //////////////////////////////////////////////
  useEffect(() => {
    const updateHeight = () => {
      const heightInVh =
        (sectionRef.current.offsetHeight / window.innerHeight) * 100;
      sectionRef.current.style.top = `-${heightInVh - 100}vh`;
    };
    updateHeight();
    window.addEventListener("scroll", updateHeight);

    return () => {
      window.removeEventListener("scroll", updateHeight);
    };
  }, []);
  /////////////////////////////////////// FUNCTIONS /////////////////////////////////////////////
  const handleChange = (e) => {
    setContactData({ ...contactData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BACKEND_BASE_URL}/submit`,
        contactData
      );
      localStorage.setItem(
        "contact_email",
        JSON.stringify({ email: contactData.email })
      );
      setContactData(initialState);
      setLoading(false);
      if (!data.verified) {
        setOtpFormType("contact");
        setOpenOTPModal(true);
      }
    } catch (error) {
      console.log("Error in Submitting Response ", error);
    }
  };

  const nameBlur = () => {
    if (contactData.name == ``) {
      setValidationMessage({
        ...validationMessage,
        name: "name field is required",
      });
    } else if (contactData.name.length < 3) {
      setValidationMessage({
        ...validationMessage,
        name: "name must be atleast of 3 character",
      });
    } else {
      setValidationMessage({ ...validationMessage, name: "" });
    }
  };

  const emailBlur = () => {
    if (contactData.email == ``) {
      setValidationMessage({
        ...validationMessage,
        email: "email field is required",
      });
    } else if (!validator.validate(contactData.email)) {
      setValidationMessage({
        ...validationMessage,
        email: "please enter valid email address",
      });
    } else {
      setValidationMessage({ ...validationMessage, email: "" });
    }
  };

  const subjectBlur = () => {
    if (contactData.subject == ``) {
      setValidationMessage({
        ...validationMessage,
        subject: "subject field is required",
      });
    } else if (contactData.subject.length < 3) {
      setValidationMessage({
        ...validationMessage,
        subject: "subject must be atleast of 3 character",
      });
    } else {
      setValidationMessage({ ...validationMessage, subject: "" });
    }
  };

  const messageBlur = () => {
    if (contactData.message == ``) {
      setValidationMessage({
        ...validationMessage,
        message: "message field is required",
      });
    } else if (contactData.message.length < 20) {
      setValidationMessage({
        ...validationMessage,
        message: "message must be atleast of 20 character",
      });
    } else {
      setValidationMessage({ ...validationMessage, message: "" });
    }
  };

  return (
    <section
      ref={sectionRef}
      name="contact"
      style={{ backgroundImage: `url(${contact})` }}
      className=" 
            flex flex-col justify-between items-center gap-[5rem] z-10 w-full bg-black  pt-[10rem]
            px-[14px] py-[7rem] sticky top-0
            sm:px-[3rem] sm:py-[7rem]
            md:px-[64px] md:py-[10rem]
        "
    >
      <div className="absolute top-0 right-[50%] transform translate-x-[-50%] flex justify-between gap-[2rem] ">
        <hr className="h-[7rem] w-[4px] bg-white " />
      </div>

      <Heading
        subHeading="Contact"
        heading="Reach out for a new project or just say hello"
        subHeadingColor="green"
        headingColor="white"
      />

      {/* contact form */}
      <motion.div
        whileInView={{ y: [0, 1], opacity: [0, 1] }}
        transition={{ duration: 0.3 }}
        className="flex w-full h-full xl:px-[8rem] lg:flex-row lg:px-[5rem] md:flex-col md:px-[2rem] sm:flex-col sm:px-[2rem] px-0 flex-col "
      >
        {/* left contact side */}
        <div className="opacity-80 bg-lightGray flex flex-col gap-[5rem] lg:w-[65%] md:w-full md:px-[3rem] md:pt-[4rem] md:pb-[6rem] sm:w-full sm:px-[3rem] sm:pt-[3rem] sm:pb-[5rem] w-full px-[1rem] pt-[3rem] pb-[3rem]  ">
          {/* heading */}
          <h4 className="uppercase text-white ">send a message</h4>
          {/* inputs */}
          <form
            action="https://formspree.io/f/xbjedvea"
            method="POST"
            className="flex flex-col gap-[2rem] "
          >
            {/* name */}
            <div className="relative">
              <input
                autoComplete="off"
                type="text"
                placeholder="Name"
                name="name"
                value={contactData.name}
                onChange={handleChange}
                onBlur={nameBlur}
                className="bg-inherit w-full border-b-[1px] border-textGray p-[1rem] outline-none pl-0  "
                required
              />
              {validationMessage.name && (
                <motion.div
                  animate={{ opacity: [0, 1], scale: [0.8, 1] }}
                  className="absolute bottom-[-14px] right-0 rounded-[4px] w-fit p-[4px] bg-green  "
                >
                  <span className="relative flex items-center gap-[8px]  w-full h-full ">
                    <span className="absolute top-[50%] transform translate-y-[-50%] left-[-22px] border-[10px] border-transparent border-r-green " />
                    <p className="">{validationMessage.name}</p>
                    <Close
                      onClick={() =>
                        setValidationMessage({ ...validationMessage, name: "" })
                      }
                      className="text-[16px] cursor-pointer "
                    />
                  </span>
                </motion.div>
              )}
            </div>
            {/* email */}
            <div className="relative">
              <input
                autoComplete="off"
                type="email"
                placeholder="Email"
                name="email"
                value={contactData.email}
                onChange={handleChange}
                onBlur={emailBlur}
                className="bg-inherit w-full border-b-[1px] border-textGray p-[1rem] outline-none pl-0  "
                required
              />
              {validationMessage.email && (
                <motion.div
                  animate={{ opacity: [0, 1], scale: [0.8, 1] }}
                  className="absolute bottom-[-14px] right-0 rounded-[4px] w-fit p-[4px] bg-green  "
                >
                  <span className="relative flex items-center gap-[8px]  w-full h-full ">
                    <span className="absolute top-[50%] transform translate-y-[-50%] left-[-22px] border-[10px] border-transparent border-r-green " />
                    <p className="">{validationMessage.email}</p>
                    <Close
                      onClick={() =>
                        setValidationMessage({
                          ...validationMessage,
                          email: "",
                        })
                      }
                      className="text-[16px] cursor-pointer "
                    />
                  </span>
                </motion.div>
              )}
            </div>
            {/* subject */}
            <div className="relative">
              <input
                autoComplete="off"
                type="text"
                placeholder="Subject"
                name="subject"
                value={contactData.subject}
                onChange={handleChange}
                onBlur={subjectBlur}
                className="bg-inherit w-full border-b-[1px] border-textGray p-[1rem] outline-none pl-0  "
              />
              {validationMessage.subject && (
                <motion.div
                  animate={{ opacity: [0, 1], scale: [0.8, 1] }}
                  className="absolute bottom-[-14px] right-0 rounded-[4px] w-fit p-[4px] bg-green  "
                >
                  <span className="relative flex items-center gap-[8px]  w-full h-full ">
                    <span className="absolute top-[50%] transform translate-y-[-50%] left-[-22px] border-[10px] border-transparent border-r-green " />
                    <p className="">{validationMessage.subject}</p>
                    <Close
                      onClick={() =>
                        setValidationMessage({
                          ...validationMessage,
                          subject: "",
                        })
                      }
                      className="text-[16px] cursor-pointer "
                    />
                  </span>
                </motion.div>
              )}
            </div>
            {/* message */}
            <div className="relative">
              <textarea
                autoComplete="off"
                type="text"
                placeholder="Message"
                name="message"
                value={contactData.message}
                onChange={handleChange}
                onBlur={messageBlur}
                className="bg-inherit w-full border-b-[1px] border-textGray p-[1rem] outline-none pl-0 resize-none "
                rows={8}
                required
              />
              {validationMessage.message && (
                <motion.div
                  animate={{ opacity: [0, 1], scale: [0.8, 1] }}
                  className="absolute bottom-[-8px] right-0 rounded-[4px] w-fit p-[4px] bg-green  "
                >
                  <span className="relative flex items-center gap-[8px]  w-full h-full ">
                    <span className="absolute top-[50%] transform translate-y-[-50%] left-[-22px] border-[10px] border-transparent border-r-green " />
                    <p className="">{validationMessage.message}</p>
                    <Close
                      onClick={() =>
                        setValidationMessage({
                          ...validationMessage,
                          message: "",
                        })
                      }
                      className="text-[16px] cursor-pointer "
                    />
                  </span>
                </motion.div>
              )}
            </div>
            {/* send button */}
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={!validated}
              className={`w-full bg-green text-white p-[1rem] ${
                validated ? "cursor-pointer" : ""
              } `}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* right contact side */}
        <div className="bg-darkGray flex flex-col md:gap-[2rem] lg:w-[35%] md:w-full md:px-[3rem] md:pt-[4rem] md:pb-[6rem] sm:w-full sm:px-[3rem] sm:pt-[3rem] sm:pb-[5rem] w-full px-[1rem] pt-[3rem] pb-[3rem]  ">
          <h4 className="uppercase text-white lg:block md:hidden sm:hidden hidden ">
            contact info
          </h4>
          <div className="flex flex-col gap-[3rem] ">
            {/* info */}
            <div className="flex flex-col gap-[1.5rem] ">
              {/* address */}
              <div className="flex flex-col gap-[0.7rem] ">
                <h5 className="text-green text-[24px] capitalize  ">
                  where to find
                </h5>
                <p className="flex flex-col gap-[8px] ">
                  <span className="">Delhi IND</span>
                  <span className="">INDIA</span>
                </p>
              </div>
              {/* email */}
              <div className="flex flex-col gap-[1rem] ">
                <h5 className="text-green text-[24px] capitalize  ">
                  email at
                </h5>
                <p className="flex flex-col gap-[8px] ">
                  <span className="">devk77785@gmail.com</span>
                </p>
              </div>
              {/* phone */}
              <div className="flex flex-col gap-[1rem] ">
                <h5 className="text-green text-[24px] capitalize  ">call at</h5>
                <p className="flex flex-col gap-[8px] ">
                  <span className="">Phone: (+91) 000000000</span>
                </p>
              </div>
            </div>
            {/* social icons */}
            <div className="flex flex-col gap-[1rem] ">
              <h5 className="text-green text-[24px] capitalize  ">Connect Me</h5>
              <div className="flex flex-col">
                <div className="flex justify-start gap-x-2">
                  <LinkedIn className="text-[1.5rem] " />
                  <Link
                    to={"https://www.linkedin.com/in/dev-kumar-3281a1206/"}
                    className="hover:text-green "
                  >
                    linkedin.com/in/dev
                  </Link>
                </div>
                <div className="flex justify-start gap-x-2 mt-4 ">
                  <GitHub className="text-[1.5rem] " />
                  <Link
                    to={"https://github.com/gbcCreator"}
                    className="hover:text-green "
                  >
                    github.com/gbcCreator
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
