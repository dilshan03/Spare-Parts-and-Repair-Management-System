import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import "./RepairRequestForm.css";
import { ToastContainer, toast } from "react-toastify";//for notifycation
import "react-toastify/dist/ReactToastify.css";//for notifycation
 

function RepairRequestForm() {
  const [currentStep, setCurrentStep] = useState(1); // Track the current step
  const navigate = useNavigate();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm();

  // Handle Next Step
  const handleNext = async () => {
    let isValid = false;

    // Validate fields based on the current step
    if (currentStep === 1) {
      isValid = await trigger([
        "customerNameR",
        "contactNumberR",
        "emailR",
        "addressR",
      ]);
    } else if (currentStep === 2) {
      isValid = await trigger([
        "vehicleRegiNumberR",
        "vehicleMakeR",
        "vehicleModelR",
        "yearOfManufactureR",
        "mileageR",
        "vehicleIdentiNumberR",
      ]);
    }
    // else if (currentStep === 2) {
    //   isValid = await trigger([
    //     "vehiclePhotoR",
    //     "serviceTypeR",
    //     "descripIssueR",
    //     "prefDateAndTimeR",
    //     "urgencyLevelR",
    //     "paymentMethodR",
    //   ]);
    // }

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle Previous Step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  
    const onSubmit = (data) => {
      const token = localStorage.getItem("token");
      const formData = new FormData();
    
      for (const key in data) {
        if (key === "vehiclePhotoR") {
          formData.append(key, data[key][0]); // File
        } else {
          formData.append(key, data[key]);
        }
      }
    
      axios
        .post("http://localhost:5000/api/repairRequest/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((result) => {
          console.log(result);
          toast.success("Repair request submitted successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
          // Reset form after toast displays
          setTimeout(() => {
            window.location.reload();
          }, 3000); // Wait for toast to display before reload
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to submit repair request!", {
            position: "top-right",
            autoClose: 3000,
          });
        });
    };
    
    // In your JSX, place ONE ToastContainer at the root level (right before closing the main container div):
    <ToastContainer />


    // const onSubmit = (data) => {
    //   const token = localStorage.getItem("token");
    //   const formData = new FormData();
    
    //   for (const key in data) {
    //     if (key === "vehiclePhotoR") {
    //       formData.append(key, data[key][0]); // File
    //     } else {
    //       formData.append(key, data[key]);
    //     }
    //   }
    
    //   axios
    //     .post("http://localhost:5000/api/repairRequest/", formData, {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "multipart/form-data",
    //       },
    //     })
    //     .then((result) => {
    //       console.log(result);
    //       toast.success("Repair request submitted successfully!", {
    //         position: "top-right", // ✅ Fixed here
    //         autoClose: 3000,
    //       });
    //       // Reset the form after success
    //       window.location.reload(); // ✅ Refresh the page
    //     })
    //     .catch((err) => {
    //       console.error(err);
    //       toast.error("Failed to submit repair request!", {
    //         position: "top-right", // ✅ Fixed here
    //         autoClose: 3000,
    //       });
    //     });
    // };
    
 
    
  return (
    <div className="container">
      <div className="contact-form">
        <fieldset>
          <h1>REPAIR REQUEST FORM</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Step Navigation */}
            <div className="step-navigation">
              <div
                className={`step ${currentStep >= 1 ? "completed" : ""} ${
                  currentStep === 1 ? "active" : ""
                }`}
                onClick={() => setCurrentStep(1)}
              >
                Step 1: Customer Details
              </div>
              <div
                className={`step ${currentStep >= 2 ? "completed" : ""} ${
                  currentStep === 2 ? "active" : ""
                }`}
                onClick={() => setCurrentStep(2)}
              >
                Step 2: Vehicle Details
              </div>
              <div
                className={`step ${currentStep >= 3 ? "completed" : ""} ${
                  currentStep === 3 ? "active" : ""
                }`}
                onClick={() => setCurrentStep(3)}
              >
                Step 3: Repair Details
              </div>
            </div>

            {/* Step 1: Customer Details */}
            {currentStep === 1 && (
              <div className="step">
                <h2>Customer Details</h2>
                <div className="form-group">
                  <label htmlFor="customerNameR" style={{ textAlign: "left" }}>
                    Customer Name
                  </label>
                  <input 
                    type="text"
                    className="form-control"
                    id="customerNameR"
                    placeholder="Enter your full name"
                    {...register("customerNameR" , { required:  "Customer Name is required" })}
                  />
                  <ErrorMessage
                    errors={errors}
                    name="customerNameR"
                    render={({ message }) => (
                      <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                    )}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="contactNumberR" style={{ textAlign: "left" }}>
                        Contact Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="contactNumberR"
                        placeholder="Enter contact number"
                        {...register("contactNumberR", { required: "Contact Number is required" })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="contactNumberR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="emailR" style={{ textAlign: "left" }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="emailR"
                        placeholder="Enter email"
                        {...register("emailR", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="emailR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="addressR" style={{ textAlign: "left" }}>
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="addressR"
                    placeholder="Enter your address"
                    {...register("addressR", { required: "Your address is required" })}
                  />
                 <ErrorMessage
                        errors={errors}
                        name="addressR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}

            {/* Step 2: Vehicle Details */}
            {currentStep === 2 && (
              <div className="step">
                <h2>Vehicle Details</h2>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="vehicleRegiNumberR" style={{ textAlign: "left" }}>
                        Vehicle Registration Number
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vehicleRegiNumberR"
                        placeholder="Enter registration number"
                        {...register("vehicleRegiNumberR", {
                          required: "Vehicle Registration Number is required",
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="vehicleRegiNumberR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>

                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="vehicleMakeR" style={{ textAlign: "left" }}>
                        Vehicle Make
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vehicleMakeR"
                        placeholder="Enter vehicle make"
                        {...register("vehicleMakeR", {
                          required: "Vehicle Make is required",
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="vehicleMakeR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div> */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="vehicleMakeR" style={{ textAlign: "left" }}>
                        Vehicle Make (Sri Lanka)
                      </label>
                      <select
                        className="form-control"
                        id="vehicleMakeR"
                        {...register("vehicleMakeR", {
                          required: "Vehicle Make is required",
                        })}
                      >
                        <option value="">Select a vehicle make</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Honda">Honda</option>
                        <option value="Suzuki">Suzuki</option>
                        <option value="Nissan">Nissan</option>
                        <option value="Mitsubishi">Mitsubishi</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="Isuzu">Isuzu</option>
                        <option value="BMW">BMW</option>
                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                        <option value="Audi">Audi</option>
                        <option value="Volkswagen">Volkswagen</option>
                        {/* Add more vehicle makes based on your need */}
                      </select>

                      <ErrorMessage
                        errors={errors}
                        name="vehicleMakeR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>

                </div>

                <div className="row">
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="vehicleModelR" style={{ textAlign: "left" }}>
                        Vehicle Model
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vehicleModelR"
                        placeholder="Enter vehicle model"
                        {...register("vehicleModelR", {
                          required: "Vehicle Model is required",
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="vehicleModelR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div> */}

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="vehicleModelR" style={{ textAlign: "left" }}>
                        Vehicle Model
                      </label>
                      <select
                        className="form-control"
                        id="vehicleModelR"
                        {...register("vehicleModelR", {
                          required: "Vehicle Model is required",
                        })}
                      >
                        <option value="">Select a vehicle model</option>

                        {/* Toyota Models */}
                        <option value="Toyota Corolla">Toyota Corolla</option>
                        <option value="Toyota Camry">Toyota Camry</option>
                        <option value="Toyota Hilux">Toyota Hilux</option>
                        <option value="Toyota RAV4">Toyota RAV4</option>
                        <option value="Toyota Land Cruiser">Toyota Land Cruiser</option>

                        {/* Honda Models */}
                        <option value="Honda Civic">Honda Civic</option>
                        <option value="Honda Accord">Honda Accord</option>
                        <option value="Honda CR-V">Honda CR-V</option>
                        <option value="Honda Jazz">Honda Jazz</option>
                        <option value="Honda HR-V">Honda HR-V</option>

                        {/* Suzuki Models */}
                        <option value="Suzuki Swift">Suzuki Swift</option>
                        <option value="Suzuki Alto">Suzuki Alto</option>
                        <option value="Suzuki Vitara">Suzuki Vitara</option>
                        <option value="Suzuki Baleno">Suzuki Baleno</option>
                        <option value="Suzuki Wagon R">Suzuki Wagon R</option>

                        {/* Nissan Models */}
                        <option value="Nissan Altima">Nissan Altima</option>
                        <option value="Nissan Sentra">Nissan Sentra</option>
                        <option value="Nissan X-Trail">Nissan X-Trail</option>
                        <option value="Nissan Leaf">Nissan Leaf</option>
                        <option value="Nissan Pathfinder">Nissan Pathfinder</option>

                        {/* Mitsubishi Models */}
                        <option value="Mitsubishi Outlander">Mitsubishi Outlander</option>
                        <option value="Mitsubishi Lancer">Mitsubishi Lancer</option>
                        <option value="Mitsubishi ASX">Mitsubishi ASX</option>
                        <option value="Mitsubishi Pajero">Mitsubishi Pajero</option>
                        <option value="Mitsubishi Triton">Mitsubishi Triton</option>

                        {/* Hyundai Models */}
                        <option value="Hyundai Elantra">Hyundai Elantra</option>
                        <option value="Hyundai Tucson">Hyundai Tucson</option>
                        <option value="Hyundai Santa Fe">Hyundai Santa Fe</option>
                        <option value="Hyundai Kona">Hyundai Kona</option>
                        <option value="Hyundai Sonata">Hyundai Sonata</option>

                        {/* Isuzu Models */}
                        <option value="Isuzu D-Max">Isuzu D-Max</option>
                        <option value="Isuzu MU-X">Isuzu MU-X</option>
                        <option value="Isuzu N-Series">Isuzu N-Series</option>
                        <option value="Isuzu Elf">Isuzu Elf</option>

                        {/* BMW Models */}
                        <option value="BMW 3 Series">BMW 3 Series</option>
                        <option value="BMW 5 Series">BMW 5 Series</option>
                        <option value="BMW X5">BMW X5</option>
                        <option value="BMW X3">BMW X3</option>
                        <option value="BMW 7 Series">BMW 7 Series</option>

                        {/* Mercedes-Benz Models */}
                        <option value="Mercedes-Benz C-Class">Mercedes-Benz C-Class</option>
                        <option value="Mercedes-Benz E-Class">Mercedes-Benz E-Class</option>
                        <option value="Mercedes-Benz S-Class">Mercedes-Benz S-Class</option>
                        <option value="Mercedes-Benz GLC">Mercedes-Benz GLC</option>
                        <option value="Mercedes-Benz GLE">Mercedes-Benz GLE</option>

                        {/* Audi Models */}
                        <option value="Audi A3">Audi A3</option>
                        <option value="Audi A4">Audi A4</option>
                        <option value="Audi A6">Audi A6</option>
                        <option value="Audi Q5">Audi Q5</option>
                        <option value="Audi Q7">Audi Q7</option>

                        {/* Volkswagen Models */}
                        <option value="Volkswagen Golf">Volkswagen Golf</option>
                        <option value="Volkswagen Passat">Volkswagen Passat</option>
                        <option value="Volkswagen Polo">Volkswagen Polo</option>
                        <option value="Volkswagen Tiguan">Volkswagen Tiguan</option>
                        <option value="Volkswagen Jetta">Volkswagen Jetta</option>
                      </select>

                      <ErrorMessage
                        errors={errors}
                        name="vehicleModelR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>

                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="yearOfManufactureR" style={{ textAlign: "left" }}>
                        Year of Manufacture
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="yearOfManufactureR"
                        placeholder="Enter year"
                        {...register("yearOfManufactureR", {
                          required: "Year of Manufacture is required",
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="yearOfManufactureR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div> */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="yearOfManufactureR" style={{ textAlign: "left" }}>
                        Year of Manufacture
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="yearOfManufactureR"
                        placeholder="Enter year"
                        min="1900"
                        max={new Date().getFullYear()}
                        {...register("yearOfManufactureR", {
                          required: "Year of Manufacture is required",
                          min: { value: 1900, message: "Year must be 1900 or later" },
                          max: {
                            value: new Date().getFullYear(),
                            message: `Year cannot be later than ${new Date().getFullYear()}`,
                          },
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="yearOfManufactureR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>



                </div>

                <div className="row">


                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="mileageR" style={{ textAlign: "left" }}>
                        Mileage
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="mileageR"
                        placeholder="Enter mileage"
                        {...register("mileageR")}
                      />
                    </div>
                  </div> */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="mileageR" style={{ textAlign: "left" }}>
                        Mileage (km)
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="mileageR"
                        placeholder="Enter mileage"
                        min="0"
                        max="1000000"
                        {...register("mileageR", {
                          required: "Mileage is required",
                          min: { value: 0, message: "Mileage cannot be negative" },
                          max: { value: 1000000, message: "Mileage cannot exceed 1,000,000 km" },
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="mileageR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>



                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="vehicleIdentiNumberR" style={{ textAlign: "left" }}>
                        Vehicle Identification Number (VIN)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="vehicleIdentiNumberR"
                        placeholder="Enter VIN"
                        {...register("vehicleIdentiNumberR", { required: "Your Vehicle ID number is required" })}
                        />
                       <ErrorMessage
                              errors={errors}
                              name="vehicleIdentiNumberR"
                              render={({ message }) => (
                                <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                              )}
                            />
                    </div>
                  </div> */}

                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="vehicleIdentiNumberR" style={{ textAlign: "left" }}>
                        Vehicle Identification Number (VIN)
                      </label>
                      {/* <input
                        type="text"
                        className="form-control"
                        id="vehicleIdentiNumberR"
                        placeholder="Enter VIN"
                        {...register("vehicleIdentiNumberR", {
                          required: "Your Vehicle ID number is required",
                          pattern: {
                            value: /^\d{7}$/, // Regex to ensure exactly 6 digits
                            // value: /^(?:[A-Z]{3}\d{3,4}|[A-Z]{2}\d{3,4})$/, // Regex to ensure exactly 6 digits
                            
                            message: "VIN must be exactly 7 numbers", // Error message for invalid input
                          },
                        })}
                      /> */}
                      <input
                        type="text"
                        className="form-control"
                        id="vehicleIdentiNumberR"
                        placeholder="Enter Vehicle Number"
                        {...register("vehicleIdentiNumberR", {
                          required: "Your Vehicle Number is required",
                          pattern: {
                            value: /^([A-Z]{2,3}-\d{4}|[A-Z]{2,3}\d{4})$/,
                            message: "Invalid Vehicle Number format (e.g., CA-1234 or WPX1234)",
                          },
                        })}
                      />

                      <ErrorMessage
                        errors={errors}
                        name="vehicleIdentiNumberR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            )}

            {/* Step 3: Repair Details */}
            {currentStep === 3 && (
              <div className="step">
                <h2>Repair Details</h2>
                <div className="row">
                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="vehiclePhotoR" style={{ textAlign: "left" }}>Vehicle Photo</label>
                      <input
                        type="file"
                        className="form-control"
                        id="vehiclePhotoR"
                        {...register("vehiclePhotoR")}
                      />
                    </div>
                  </div> */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="vehiclePhotoR" style={{ textAlign: "left" }}>Vehicle Photo</label>
                      <input
                        type="file"
                        className="form-control"
                        id="vehiclePhotoR"
                        accept="image/*" // Restrict file types to images only
                        {...register("vehiclePhotoR", {
                          required: "Vehicle photo is required", // Ensure a file is selected
                          validate: {
                            isImage: (fileList) => {
                              if (fileList && fileList[0]) {
                                const file = fileList[0];
                                return (
                                  file.type.startsWith("image/") || "Only image files are allowed"
                                );
                              }
                              return true;
                            },
                          },
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="vehiclePhotoR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>



                  {/* <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="serviceTypeR" style={{ textAlign: "left" }}>Service Type</label> */}
                      {/* <input
                        type="text"
                        className="form-control"
                        id="serviceTypeR"
                        placeholder="Enter service type"
                        {...register("serviceTypeR", {
                          required: "Service Type is required",
                        })}
                      /> */}
                      {/* <select
                        className="form-control"
                        id="serviceTypeR"
                        placeholder="Enter service type"
                        {...register("serviceTypeR", {
                          required: "Service Type is required",
                        })}
                      >
                        <option value="Cash">Vehicle Repair</option>
                        <option value="Card">Vehicle Restoreation</option>
                        <option value="Online Payment">Service</option>
                      </select>

                      <ErrorMessage
                        errors={errors}
                        name="serviceTypeR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div> */}
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="serviceTypeR" style={{ textAlign: "left" }}>Service Type</label>
                      <select
                        className="form-control"
                        id="serviceTypeR"
                        {...register("serviceTypeR", {
                          required: "Service Type is required",
                        })}
                      >
                        <option value="">Select a service type</option>
                        {/* <option value="Vehicle Repair">Vehicle Repair</option>
                        <option value="Vehicle Restoration">Vehicle Restoration</option>
                        <option value="General Service">General Service</option>
                        <option value="Oil Change">Oil Change</option>
                        <option value="Tire Replacement">Tire Replacement</option>
                        <option value="Battery Replacement">Battery Replacement</option>
                        <option value="Brake Inspection">Brake Inspection</option> */}
                        <option value="Vehicle Repair">Vehicle Repair</option>
                        <option value="Vehicle Restoration">Vehicle Restoration</option>
                        <option value="General Service">General Service</option> 
                        <option value="Tire Replacement">Tire Replacement</option>
                        <option value="Battery Replacement">Battery Replacement</option>
                        <option value="Brake Inspection">Brake Inspection</option>
                        <option value="Paint Repair">Paint Repair</option>
                        <option value="Dent Repair">Dent Repair</option>
                        <option value="Windshield Repair">Windshield Repair</option>
                        <option value="Rust Repair">Rust Repair</option>
                        <option value="AC Repair">AC Repair</option>
                        <option value="Electrical Repair">Electrical Repair</option>
                        <option value="Interior Repair">Interior Repair</option>
                        <option value="Bodywork Repair">Bodywork Repair</option>

                      </select>

                      <ErrorMessage
                        errors={errors}
                        name="serviceTypeR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>




                </div>

                <div className="form-group">
                  <label htmlFor="descripIssueR" style={{ textAlign: "left" }}>Description of Issue</label>
                  <textarea
                    className="form-control"
                    id="descripIssueR"
                    rows="3"
                    placeholder="Describe the issue"
                    {...register("descripIssueR", {
                      required: "Description of Issue is required",
                    })}
                  ></textarea>
                  <ErrorMessage
                    errors={errors}
                    name="descripIssueR"
                    render={({ message }) => (
                      <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                    )}
                  />
                </div>

                <div className="row">
                  {/* <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="prefDateAndTimeR" style={{ textAlign: "left" }}>Preferred Date and Time</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="prefDateAndTimeR"
                        {...register("prefDateAndTimeR", {
                          required: "Preferred Date and Time is required",
                        })}
                      />
                      <ErrorMessage
                        errors={errors}
                        name="prefDateAndTimeR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div> */}

            <div className="col-md-4">
              <div className="form-group">
                <label htmlFor="prefDateAndTimeR" style={{ textAlign: "left" }}>
                  Preferred Date and Time
                </label>
                <input
                  type="datetime-local"
                  className="form-control"
                  id="prefDateAndTimeR"
                  {...register("prefDateAndTimeR", {
                    required: "Preferred Date and Time is required",
                    validate: (value) => {
                      const selectedDate = new Date(value);
                      const now = new Date();
                      return selectedDate > now || "Please select a future date and time";
                    },
                  })}
                  min={new Date().toISOString().slice(0, 16)} // min = now in datetime-local format
                />
                <ErrorMessage
                  errors={errors}
                  name="prefDateAndTimeR"
                  render={({ message }) => (
                    <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                  )}
                />
              </div>
            </div>



                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="urgencyLevelR" style={{ textAlign: "left" }}>Urgency Level</label>
                      <select
                        className="form-control"
                        id="urgencyLevelR"
                        {...register("urgencyLevelR", {
                          required: "Urgency Level is required",
                        })}
                      >
                        <option value="Normal">Normal</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                      <ErrorMessage
                        errors={errors}
                        name="urgencyLevelR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>

                  
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="paymentMethodR" style={{ textAlign: "left" }}>Payment Method</label>
                      <select
                        className="form-control"
                        id="paymentMethodR"
                        {...register("paymentMethodR", {
                          required: "Payment Method is required",
                        })}
                      >
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                        <option value="Online Payment">Online Payment</option>
                      </select>
                      <ErrorMessage
                        errors={errors}
                        name="paymentMethodR"
                        render={({ message }) => (
                          <p className="error-message" style={{ textAlign: "left" }}>{message}</p>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBack}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            )}
          </form>
          <ToastContainer />
        </fieldset>
        <ToastContainer />
      </div>
    </div>
  );
}

export default RepairRequestForm;