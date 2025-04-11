
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl;
      
      // If there's a file to upload, upload it first
      if (uploadedFile) {
        try {
          finalImageUrl = await uploadProjectImage(uploadedFile);
          console.log("Uploaded image URL:", finalImageUrl);
          
          // If we're editing and replacing an existing image, delete the old one
          if (mode === 'edit' && project && project.image && isProjectImage(project.image)) {
            try {
              await deleteProjectImage(project.image);
              console.log("Deleted old image:", project.image);
            } catch (deleteError: any) {
              console.error("Failed to delete old image:", deleteError);
              // Continue even if old image deletion fails
            }
          }
        } catch (uploadError: any) {
          toast.error(`Failed to upload image: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Validate required fields
      if (!title || !description || !category) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }
      
      // Create project object
      const projectData = {
        title,
        description,
        github: github || "#",
        demo: demo || "#",
        image: finalImageUrl || "/placeholder.svg",
        category,
        tags: tags
      };

      console.log(`${mode === 'add' ? 'Adding' : 'Updating'} project data:`, projectData);
      
      if (mode === 'add') {
        // Add new project
        await addProject(projectData);
        toast.success("Project added successfully!");
      } else if (project && project.id) {
        // Update existing project
        console.log(`Updating project ID: ${project.id} with:`, projectData);
        await updateProject(project.id, projectData);
        toast.success("Project updated successfully!");
      }

      // Clear form fields
      setTitle("");
      setDescription("");
      setGithub("");
      setDemo("");
      setImageUrl("");
      setCategory("");
      setTags([]);
      setNewTag("");
      setUploadedFile(null);

      // Refresh projects list
      await onProjectAdded();
    } catch (error: any) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} project:`, error);
      toast.error(`Failed to ${mode === 'add' ? 'add' : 'update'} project: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelected = (file: File) => {
    setUploadedFile(file);
    // Clear any direct URL since we'll be uploading this file
    setImageUrl("");
  };

  const handleClearFile = () => {
    setUploadedFile(null);
  };
  
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
