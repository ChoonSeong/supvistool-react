import React, { useState } from "react";
import {
  Button,
  Heading,
  Input,
  IconButton,
  FormControl,
  FormLabel,
  Flex,
  Text,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";

export default function Register() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBack = () => {
    navigate("/"); // Go back to the previous page
  };

  const handleRegister = () => {
    navigate("/"); // Go back to the previous page
  };

  const [initialValues, setInitialValues] = useState({
    userName: "",
    email: "",
    password: 0,
    confirmPassword: "",
  });

  /**
   * Returns validation result for user name.
   */
  const isValidUserName = (userName) => {
    try {
      const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;

      // Checks if the user name is according to the regex.
      const isValid = USER_REGEX.test(userName);

      // Checks if the user name is valid.
      if (!isValid) {
        return {
          isValid: false,
          errorMessage:
            "4 to 24 characters.\nMust begin with a letter.\nLetters, numbers, underscores, hyphens allowed.",
        };
      } else {
        return {
          isValid: true,
          errorMessage: "",
        };
      }
    } catch (error) {
      // Catch any unforesen errors while validating.
      return {
        isValid: false,
        errorMessage: `Error: ${error}`,
      };
    }
  };

  /**
   * Returns validation result for password.
   */
  const isValidPassword = (password) => {
    try {
      const PWD_REGEX =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

      // Checks if the password is valid according to the regex.
      const isValid = PWD_REGEX.test(password);

      // Checks if the password is valid.
      if (!isValid) {
        return {
          isValid: false,
          errorMessage:
            "8 to 24 characters.\nMust include uppercase and lowercase letters, a number and a special character.\nAllowed special characters: !, @, #, $ and %",
        };
      } else {
        return {
          isValid: true,
          errorMessage: "",
        };
      }
    } catch (error) {
      // Catch any unforesen errors while validating.
      return {
        isValid: false,
        errorMessage: `Error: ${error}`,
      };
    }
  };

  const RegisterPageSchema = Yup.object().shape({
    userName: Yup.string()
      .required("Required")
      .test("user-name-validator", function (value) {
        const validation = isValidUserName(value);
        if (!validation.isValid) {
          return this.createError({
            path: this.path,
            message: validation.errorMessage,
          });
        } else {
          return true;
        }
      }),
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .required("Required")
      .test("password-validator", function (value) {
        const validation = isValidPassword(value);
        if (!validation.isValid) {
          return this.createError({
            path: this.path,
            message: validation.errorMessage,
          });
        } else {
          return true;
        }
      }),
    confirmPassword: Yup.string()
      .required("Required")
      .test(
        "is-password-confirmed",
        "Must match the first password input field.",
        function (value) {
          const { password } = this.parent;
          return !password || (value && value == password);
        }
      ),
  });

  // Custom hook to handle form state and submission using Formik.
  const formik = useFormik({
    // Initialise Original Event Data if event is being editted, or default values if event is being created.
    initialValues: initialValues,
    // Initialise the validation schema used in the form.
    validationSchema: RegisterPageSchema,
    onSubmit: () => {
      handleRegister();
    },
    validateOnChange: true, // Validates when there are changes in values.
  });
  return (
    <Flex w="50%" h="100%" align="center" justify="center" my={16}>
      <IconButton
        position="absolute"
        top={4}
        left={4}
        colorScheme="gray"
        icon={<IoArrowBackCircleOutline style={{ fontSize: "2rem" }} />}
        onClick={handleBack}
      />
      <form
        onSubmit={formik.handleSubmit}
        style={{
          width: "60%",
          padding: "2rem",
          backgroundColor: "white",
          boxShadow: "md",
          borderRadius: "lg",
        }}
      >
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          Register
        </Heading>

        {/* Registration Form */}
        <FormControl id="userName" mb={4}>
          <FormLabel htmlFor="userName">User Name</FormLabel>
          <Input
            id="userName"
            name="userName"
            type="text"
            value={formik.values.userName}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            placeholder="Enter your user name"
          />
          {formik.touched.userName && formik.errors.userName && (
            <Text color="red">{formik.errors.userName}</Text>
          )}
        </FormControl>

        <FormControl id="email" mb={4}>
          <FormLabel htmlFor="email">Email Address</FormLabel>
          <Input
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            placeholder="Enter your email"
          />
          {formik.touched.email && formik.errors.email && (
            <Text color="red">{formik.errors.email}</Text>
          )}
        </FormControl>

        <FormControl id="password" mb={4}>
          <FormLabel htmlFor="password">Password</FormLabel>
          <Input
            type="password"
            value={formik.values.password}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            placeholder="Create a password"
          />
          {formik.touched.password && formik.errors.password && (
            <Text color="red">{formik.errors.password}</Text>
          )}
        </FormControl>

        <FormControl id="confirmPassword" mb={6}>
          <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            onBlur={formik.handleBlur}
            placeholder="Confirm your password"
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <Text color="red">{formik.errors.confirmPassword}</Text>
          )}
        </FormControl>

        <Button
          onClick={handleRegister}
          isDisabled={!formik.isValid}
          colorScheme="teal"
          size="lg"
          w="100%"
        >
          Register
        </Button>
      </form>
    </Flex>
  );
}
