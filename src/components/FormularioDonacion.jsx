import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

function FormularioDonacion({ onVolver }) {
  // Configuración de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm();

  // Estados del componente
  const [previewImage, setPreviewImage] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [progress, setProgress] = useState(0); // Para barra de progreso

  // Observar cambios en el campo de imagen
  const imagenSeleccionada = watch("imagen");

  // Configuración de Axios (puede ir en un archivo aparte)
  const api = axios.create({
    //baseURL: process.env.REACT_APP_API_URL || 'https://tu-backend.com/api',
    timeout: 10000,
  });

  // Manejar cambio de imagen para vista previa
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo y tamaño de imagen
      if (!file.type.match('image.*')) {
        setSubmitError('Solo se permiten archivos de imagen');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setSubmitError('La imagen no debe exceder los 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setSubmitError(null);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  // Función para enviar los datos al backend
  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);
      setProgress(0);

      // Crear FormData para enviar archivos
      const formData = new FormData();
      
      // Agregar campos al FormData
      Object.keys(data).forEach(key => {
        if (key === 'imagen' && data[key][0]) {
          formData.append(key, data[key][0]);
        } else if (key !== 'imagen' && data[key]) {
          formData.append(key, data[key]);
        }
      });

      // Configurar interceptors para mostrar progreso (opcional)
      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Si necesitas autenticación
        }
      };

      // Enviar datos al backend
      const response = await api.post('/donaciones', formData, config);

      // Manejar respuesta exitosa
      if (response.data.success) {
        setSubmitSuccess(true);
        reset();
        setPreviewImage(null);
        
        // Opcional: cerrar formulario después de éxito
        setTimeout(() => {
          onVolver();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Error en el servidor');
      }
      
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al enviar la donación';
      
      if (error.response) {
        // El servidor respondió con un código de error
        errorMessage = error.response.data?.message || 
                      `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // La petición fue hecha pero no hubo respuesta
        errorMessage = 'No se recibió respuesta del servidor';
      } else {
        // Error al configurar la petición
        errorMessage = error.message;
      }
      
      setSubmitError(errorMessage);
      setProgress(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border rounded shadow mt-5 bg-white"
      style={{ maxWidth: "600px", margin: "auto" }}
    >
      {/* Mensajes de estado */}
      {submitSuccess && (
        <div className="alert alert-success">
          <i className="bi bi-check-circle-fill me-2"></i>
          ¡Gracias por tu donación! La información ha sido enviada correctamente.
        </div>
      )}
      
      {submitError && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {submitError}
        </div>
      )}

      {/* Barra de progreso (opcional) */}
      {isSubmitting && progress > 0 && (
        <div className="progress mb-3">
          <div 
            className="progress-bar progress-bar-striped progress-bar-animated" 
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progress}%
          </div>
        </div>
      )}

      {/* Campo: Nombre */}
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre del Donante <span className="text-danger">*</span>
        </label>
        <input
          id="nombre"
          className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
          {...register("nombre", { 
            required: "Este campo es obligatorio",
            minLength: {
              value: 3,
              message: "Mínimo 3 caracteres"
            }
          })}
          placeholder="Tu nombre completo"
          disabled={isSubmitting}
        />
        {errors.nombre && (
          <div className="invalid-feedback">
            {errors.nombre.message}
          </div>
        )}
      </div>

      {/* Campo: Tipo de Recurso */}
      <div className="mb-3">
        <label htmlFor="tipo" className="form-label">
          Tipo de Recurso <span className="text-danger">*</span>
        </label>
        <select 
          id="tipo"
          className={`form-select ${errors.tipo ? 'is-invalid' : ''}`}
          {...register("tipo", { required: "Selecciona un recurso" })}
          disabled={isSubmitting}
        >
          <option value="">-- Selecciona --</option>
          <option value="comida">Comida</option>
          <option value="ropa">Ropa</option>
          <option value="medicamentos">Medicamentos</option>
          <option value="utiles">Útiles escolares</option>
          <option value="otros">Otros</option>
        </select>
        {errors.tipo && (
          <div className="invalid-feedback">
            {errors.tipo.message}
          </div>
        )}
      </div>

      {/* Campo: Cantidad */}
      <div className="mb-3">
        <label htmlFor="cantidad" className="form-label">
          Cantidad <span className="text-danger">*</span>
        </label>
        <input
          id="cantidad"
          type="number"
          className={`form-control ${errors.cantidad ? 'is-invalid' : ''}`}
          {...register("cantidad", {
            required: "La cantidad es obligatoria",
            min: { 
              value: 1, 
              message: "Debe ser al menos 1" 
            },
            max: {
              value: 1000,
              message: "Máximo 1000 unidades"
            }
          })}
          disabled={isSubmitting}
        />
        {errors.cantidad && (
          <div className="invalid-feedback">
            {errors.cantidad.message}
          </div>
        )}
      </div>

      {/* Campo: Fecha de entrega */}
      <div className="mb-3">
        <label htmlFor="fecha" className="form-label">
          Fecha de entrega <span className="text-danger">*</span>
        </label>
        <input
          id="fecha"
          type="date"
          className={`form-control ${errors.fecha ? 'is-invalid' : ''}`}
          {...register("fecha", { 
            required: "Indica una fecha",
            validate: {
              futureDate: (value) => {
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return selectedDate >= today || "La fecha debe ser hoy o en el futuro";
              }
            }
          })}
          disabled={isSubmitting}
        />
        {errors.fecha && (
          <div className="invalid-feedback">
            {errors.fecha.message}
          </div>
        )}
      </div>

      {/* Campo: Comentarios */}
      <div className="mb-3">
        <label htmlFor="comentarios" className="form-label">
          Comentarios adicionales
        </label>
        <textarea
          id="comentarios"
          className="form-control"
          {...register("comentarios", {
            maxLength: {
              value: 500,
              message: "Máximo 500 caracteres"
            }
          })}
          placeholder="Detalles sobre tu donación..."
          rows="3"
          disabled={isSubmitting}
        />
        {errors.comentarios && (
          <small className="text-danger">
            {errors.comentarios.message}
          </small>
        )}
      </div>

      {/* Campo: Imagen */}
      <div className="mb-4">
        <label htmlFor="imagen" className="form-label">
          Foto del recurso (opcional)
        </label>
        <input
          id="imagen"
          type="file"
          accept="image/*"
          className={`form-control ${errors.imagen ? 'is-invalid' : ''}`}
          {...register("imagen", {
            validate: {
              fileSize: (files) => 
                !files[0] || files[0].size <= 5 * 1024 * 1024 || "El archivo no debe exceder 5MB",
              fileType: (files) =>
                !files[0] || files[0].type.match('image.*') || "Solo se permiten imágenes"
            }
          })}
          onChange={handleImageChange}
          disabled={isSubmitting}
        />
        {errors.imagen && (
          <div className="invalid-feedback">
            {errors.imagen.message}
          </div>
        )}
        
        {/* Vista previa de la imagen */}
        {previewImage && (
          <div className="mt-3 text-center">
            <p className="fw-bold">Vista previa:</p>
            <img
              src={previewImage}
              alt="Vista previa de la donación"
              className="img-thumbnail"
              style={{ maxHeight: "200px" }}
            />
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="d-flex justify-content-between">
        <button 
          type="button" 
          className="btn btn-outline-secondary"
          onClick={onVolver}
          disabled={isSubmitting}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver atrás
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Enviando...
            </>
          ) : (
            <>
              <i className="bi bi-send-check me-2"></i>
              Enviar Donación
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default FormularioDonacion;