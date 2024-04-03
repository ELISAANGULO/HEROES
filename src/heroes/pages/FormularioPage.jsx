import { useState, useEffect } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';

export const FormularioPage = () => {
  const [personas, setPersonas] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudadesPorPais, setCiudadesPorPais] = useState({});
  const [departamentosPorPais, setDepartamentosPorPais] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personasResponse, departamentosResponse] = await Promise.all([
          fetch('http://localhost:3001/personas'),
          fetch('http://localhost:3001/departamentos')
        ]);

        const personasData = await personasResponse.json();
        const departamentosData = await departamentosResponse.json();

        setPersonas(personasData);
        setDepartamentos(departamentosData);

        const ciudadesPorPaisObj = personasData.reduce((acc, persona) => {
          if (!acc[persona.pais]) {
            acc[persona.pais] = [];
          }
          acc[persona.pais].push(persona.ciudad);
          return acc;
        }, {});
        setCiudadesPorPais(ciudadesPorPaisObj);

        const departamentosPorPaisObj = departamentosData.reduce((acc, departamento) => {
          if (!acc[departamento.pais]) {
            acc[departamento.pais] = [];
          }
          acc[departamento.pais].push(departamento.departamento);
          return acc;
        }, {});
        setDepartamentosPorPais(departamentosPorPaisObj);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      }
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Nombre requerido'),
    correo: Yup.string().email('Formato de correo electrónico inválido').required('Correo electrónico requerido'),
  });

  return (
    <Formik
      initialValues={{ nombre: "", correo: "", pais: "", departamento: "", ciudad: "" }}
      validationSchema={validationSchema}
      onSubmit={(valores, { setSubmitting }) => {
        console.log(valores);
        console.log("formulario enviado");
        setSubmitting(false);
      }}
    >
      {({ values, handleSubmit, setFieldValue, isSubmitting }) => (
        <form className="formulario" onSubmit={handleSubmit}>
          <h1>Formulario con Formik</h1>

          <div className="formulario col-5">
            <div>
              <label>Nombre:</label>
              <Field name="nombre" type="text" />
              <ErrorMessage name="nombre" component="div" className="error" />

              <label>Correo:</label>
              <Field name="correo" type="email" />
              <ErrorMessage name="correo" component="div" className="error" />

              <label>País:</label>
              <Field as="select" name="pais" onChange={(e) => {
                const selectedCountry = e.target.value;
                setFieldValue("ciudad", ""); 
                setFieldValue("pais", selectedCountry); 
              }}>
                <option value="">Selecciona un país</option>
                {Object.keys(ciudadesPorPais).map((pais, id) => (
                  <option key={id} value={pais}>{pais}</option>
                ))}
              </Field>

              <label>Ciudad:</label>
              <Field as="select" name="ciudad">
                <option value="">Selecciona una ciudad</option>
                {ciudadesPorPais[values.pais]?.map((ciudad, id) => (
                  <option key={id} value={ciudad}>{ciudad}</option>
                ))}
              </Field>

              <label>Departamento:</label>
              <Field as="select" name="departamento">
                <option value="">Selecciona un departamento</option>
                {departamentosPorPais[values.pais]?.map((departamento, id) => (
                  <option key={id} value={departamento}>{departamento}</option>
                ))}
              </Field>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Submit</button>
          </div>
        </form>
      )}
    </Formik>
  );
};
