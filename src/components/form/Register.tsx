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
        doc.text(
          `The Price for Musical Video: ${formatCurrency(10000)}`,
          10,
          100
        );
      category === "musical_video" &&
        doc.text(`The Price for Musical Video is: ${date_time}`, 10, 100);
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
              className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
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
        <div className="bg-black w-full text-white p-3 uppercase">
          <h1 className="text-xl sm:text-4xl font-bold text-center">
            Event Registration Form
          </h1>
        </div>

        <section className="max-w-md sm:max-w-xl w-full mx-auto p-4 sm:p-8">
          {/* Image */}
          <div className="flex justify-center items-center py-6 sm:py-10">
            <Image
              src={"/speedmedia.jpg"}
              alt="speedmedia"
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>

          {slotSummaryUrl ? (
            <>
              <SuccessLayout slotSummaryUrl={slotSummaryUrl} />
            </>
          ) : (
            FormikContents
          )}
        </section>
      </div>
    </>
  );
};

export default RegisterForm;
