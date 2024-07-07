"use client";

// components/RegisterForm.tsx
import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import SuccessLayout from "./SuccessLayout";
import DatePickers from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Adjust the CSS import based on your date picker library
import Image from "next/image";

interface FormValues {
  email: string;
  name: string;
  phone_number: string;
  location: string;
  stage: string;
  backups: string;
  backups_num: string;
  audio: File | null;
  category: string;
  date_time: Date;
}
type ValuePiece = Date | null;
type Range<T> = [T, T];
type Value = ValuePiece | [ValuePiece, ValuePiece];
const RegisterForm: React.FC = () => {
  const supabase = createClient();
  const [uploading, setUploading] = useState(false);
  const [slotSummaryUrl, setSlotSummaryUrl] = useState<string | null>(null);
  const [value, onChange] = useState<Value>(new Date());
  const logoImg =
    "https://res.cloudinary.com/dwqantex4/image/upload/v1720286923/speedmedia_sehaoo.jpg";

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const initialValues: FormValues = {
    email: "",
    name: "",
    phone_number: "",
    location: "",
    stage: "",
    backups: "", // Set default value to false
    backups_num: "",
    audio: null,
    category: "",
    date_time: new Date(),
  };

  // const saveFormDataToLocalStorage = (formData: FormValues) => {
  //   localStorage.setItem("formData", JSON.stringify(formData));
  // };

  // const clearFormDataFromLocalStorage = () => {
  //   localStorage.removeItem("formData");
  // };

  // const loadFormDataFromLocalStorage = () => {
  //   const savedFormData = localStorage.getItem("formData");
  //   if (savedFormData) {
  //     return JSON.parse(savedFormData);
  //   }
  //   return initialValues;
  // };
  const saveFormDataToLocalStorage = (formData: FormValues) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("formData", JSON.stringify(formData));
    }
  };

  const clearFormDataFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("formData");
    }
  };

  const loadFormDataFromLocalStorage = () => {
    if (typeof window !== "undefined") {
      const savedFormData = localStorage.getItem("formData");
      if (savedFormData) {
        return JSON.parse(savedFormData);
      }
    }
    return initialValues;
  };

  const formatCurrency = (amount: number): string => {
    const formatter = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    });

    return formatter.format(amount);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    name: Yup.string().required("Required"),
    phone_number: Yup.string().matches(/^\d{10}$/, "Phone number is not valid"),
    location: Yup.string().required("Required"),
    stage: Yup.string().required("Required"),
    backups: Yup.string().required("Required"), // Validate boolean
    backups_num: Yup.number()
      .required("Required")
      .positive("Must be a positive number")
      .integer("Must be an integer"),
    audio: Yup.mixed()
      .required("Required")
      .test("fileFormat", "Unsupported Format", (value) => {
        if (value && value instanceof File) {
          return ["audio/mpeg", "audio/wav"].includes(value.type);
        }
        return false;
      }),
    category: Yup.string().required("Required"),
    date_time: Yup.date().required("Required"),
  });

  const onSubmit = async (
    values: FormValues,
    formik: FormikHelpers<FormValues>
  ) => {
    const {
      audio,
      backups,
      backups_num,
      email,
      location,
      name,
      phone_number,
      stage,
      category,
      date_time,
    } = values;
    if (!audio) {
      toast.error("Please select an audio file");
      return;
    }
    console.log("Form data", values);
    try {
      setUploading(true);

      // Upload audio file
      const { data: audioData, error: audioError } = await supabase.storage
        .from("media-files")
        .upload(`audio/${audio.name}`, audio);

      if (audioError) {
        toast.error(audioError.message);
        console.error(audioError.message);
      }

      // const { data, error } = await supabase
      //   .schema("formify")
      //   .from("webform")
      //   .insert([
      //     {
      //       backups,
      //       backups_num,
      //       email,
      //       location,
      //       name,
      //       phone_number,
      //       stage,
      //       category,
      //       date_time,
      //     },
      //   ])
      //   .select();

      // // Handle errors
      // if (error) {
      //   console.error("Error inserting data into Supabase:", error.message);
      //   toast.error(error.message);
      //   return;
      // }
      ////////

      // Generate slot summary
      const doc = new jsPDF();
      ///

      // Adding an image
      // const imgWidth = 100;
      // const imgHeight = 100;
      // const x = 10;
      // const y = 80;
      // doc.addImage(logoImg, "JPEG", x, y, imgWidth, imgHeight);

      doc.text(`Slot Summary for ${name}`, 10, 10);
      doc.text(`Email: ${email}`, 10, 20);
      doc.text(`Phone Number: ${phone_number}`, 10, 30);
      doc.text(`Location: ${location}`, 10, 40);
      doc.text(`Stage: ${stage}`, 10, 50);
      doc.text(`Backups: ${backups}`, 10, 60);
      doc.text(`Number of Backups: ${backups_num}`, 10, 70);
      doc.text(`Category: ${category}`, 10, 80);
      doc.text(`Date: ${date_time}`, 10, 90);
      /// other information
      category === "podcast" &&
        doc.text(`The Price for Podcast: ${formatCurrency(30000.0)}`, 10, 100);
      category === "musical_video" &&
        doc.text(
          `The Price for Musical Video is: ${formatCurrency(30000.0)}`,
          10,
          100
        );
      category === "media_training" &&
        doc.text(
          `The Price for Media Training is: ${formatCurrency(50000.0)}`,
          10,
          100
        );
      // Save PDF to Blob
      const pdfBlob = doc.output("blob");

      // Create URL for the PDF Blob
      const pdf_url = URL.createObjectURL(pdfBlob);
      setSlotSummaryUrl(pdf_url);

      ///

      const { data, error } = await supabase
        .schema("formify")
        .from("webform")
        .insert([
          {
            backups,
            backups_num,
            email,
            location,
            name,
            phone_number,
            stage,
            category,
            date_time,
            pdf_url,
          },
        ])
        .select();

      // Handle errors
      if (error) {
        console.error("Error inserting data into Supabase:", error.message);
        toast.error(error.message);
        return;
      }
      toast.success("Registration Successful");
      ////
      formik.resetForm();
      localStorage.removeItem("formData");
      clearFormDataFromLocalStorage(); // Clear local storage upon successful submission
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files");
    } finally {
      setUploading(false);
    }
  };

  const FormikContents = (
    <>
      <Formik
        initialValues={loadFormDataFromLocalStorage()}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values }) => (
          <Form className="space-y-6">
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <Field
                name="email"
                type="email"
                className="border-0 outline-none bg-slate-100 rounded-lg p-3 text-black"
              />
              <ErrorMessage name="email" className="text-red-600 text-xs" />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <Field
                name="name"
                type="text"
                className="border-0 outline-none bg-slate-100 rounded-lg p-3 text-black"
              />
              <ErrorMessage name="name" className="text-red-600 text-xs" />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number
              </label>
              <Field
                name="phone_number"
                type="text"
                className="border-0 outline-none bg-slate-100 rounded-lg p-3 text-black"
              />
              <ErrorMessage
                name="phone_number"
                className="text-red-600 text-xs"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Location
              </label>
              <Field
                name="location"
                type="text"
                className="border-0 outline-none bg-slate-100 rounded-lg p-3 text-black"
              />
              <ErrorMessage name="location" className="text-red-600 text-xs" />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category
              </label>
              <Field
                as="select"
                name="category"
                className="border-0 outline-none bg-slate-100 rounded-lg p-3 text-black"
              >
                <option value="">Select Category</option>
                <option value="podcast">Podcast</option>
                <option value="musical_video">Musical Video</option>
                <option value="media_training">Media Training</option>
              </Field>
              <ErrorMessage name="category" className="text-red-600 text-xs" />
            </div>

            {values.category !== "media_training" && (
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="date_time"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date and Time
                </label>
                <Field name="date_time">
                  {({ field }: { field: any }) => (
                    <>
                      <DatePickers
                        showIcon
                        selected={field.value}
                        onChange={(date: Value) => {
                          setFieldValue("date_time", date);
                        }}
                        className="border-0 outline-none bg-slate-100 rounded-lg px-3 py-3 text-black w-full"
                      />
                    </>
                  )}
                </Field>
                <ErrorMessage
                  name="date_time"
                  component="div"
                  className="text-red-600 text-xs"
                />
              </div>
            )}

            <div className="flex flex-col">
              <label
                htmlFor="stage"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Stage
              </label>
              <Field
                name="stage"
                type="text"
                className="border-0 outline-none bg-slate-100 rounded-lg p-3 text-black"
              />
              <ErrorMessage name="stage" className="text-red-600 text-xs" />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="backups"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Backups
              </label>
              <Field
                as="select"
                name="backups"
                className="border-0 outline-none bg-slate-100 rounded-lg p-3 text-black"
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Field>
              <ErrorMessage name="backups" className="text-red-600 text-xs" />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="backups_num"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Number of Backups
              </label>
              <Field
                name="backups_num"
                type="text"
                className="border-0 outline-none bg-slate-100 rounded-lg p-3 text-black"
              />
              <ErrorMessage
                name="backups_num"
                className="text-red-600 text-xs"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="audio"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Audio File
              </label>
              <input
                name="audio"
                type="file"
                accept="audio/*"
                className="border-0 outline-none bg-slate-100 rounded-lg p-3 text-black"
                onChange={(event) => {
                  if (event.currentTarget.files) {
                    setFieldValue("audio", event.currentTarget.files[0]);
                  }
                }}
              />
              <ErrorMessage name="audio" className="text-red-600 text-xs" />
            </div>

            <button
              type="submit"
              onClick={() => saveFormDataToLocalStorage(values)}
              disabled={uploading}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
            >
              {uploading ? "Uploading..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );

  return (
    <>
      <div>
        <div className="bg-gradient-to-r from-purple-600 to-blue-500 w-full text-white p-6 rounded-b-lg shadow-lg">
          <h1 className="text-2xl sm:text-5xl font-bold text-center mb-2">
            Program / Training Registration Form
          </h1>
          <p className="text-center text-sm sm:text-lg font-light">
            Join us for an enriching experience! Fill in the details below to
            secure your spot in our upcoming programs and training sessions.
          </p>
        </div>

        <section className="max-w-md sm:max-w-xl w-full mx-auto p-4 sm:p-8">
          {/* Image */}
          <div className="flex flex-col items-center py-6 sm:py-10">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 overflow-hidden rounded-full border-4 border-white shadow-lg">
              <Image
                src="/speedmedia.jpg"
                alt="speedmedia"
                width={160} // Adjust width and height as per your needs
                height={160} // Adjust width and height as per your needs
                className="rounded-full"
              />
            </div>
            <p className="mt-4 text-lg sm:text-xl font-semibold text-center text-gray-800">
              Welcome to <span className="text-blue-600">SpeedMedia</span>
            </p>
            <p className="text-center text-gray-600 mt-2 max-w-md">
              We are delighted to have you here. Register for our exciting and
              insightful programs and training sessions designed to empower and
              educate.
            </p>
          </div>

          {slotSummaryUrl ? (
            <>
              <SuccessLayout slotSummaryUrl={slotSummaryUrl} />
            </>
          ) : (
            FormikContents
          )}
        </section>
        <footer className="bg-black text-white p-6 mt-8">
          <div className="max-w-md sm:max-w-xl w-full mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">SpeedMedia</h2>
              <p className="text-lg font-medium">
                Program / Training Registration Form
              </p>
              <p className="text-sm font-light">
                Welcome to SpeedMedia&#39;s training registration form. Please
                fill in your details to register for our upcoming events and
                training sessions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <p className="text-lg font-semibold">
                  CONTACT:
                  <a
                    href="tel:08066925006"
                    className="hover:text-gray-400 ml-1"
                  >
                    08066925006
                  </a>
                  <span> / </span>
                  <a
                    href="tel:09081880505"
                    className="hover:text-gray-400 ml-1"
                  >
                    09081880505
                  </a>
                </p>
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/speedmediang"
                  className="hover:text-gray-400"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.instagram.com/speedmediaempire"
                  className="hover:text-gray-400"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.instagram.com/speedlighthouse"
                  className="hover:text-gray-400"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.instagram.com/speedmediastudio"
                  className="hover:text-gray-400"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm font-light">
                © 2024 SpeedMedia. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default RegisterForm;
