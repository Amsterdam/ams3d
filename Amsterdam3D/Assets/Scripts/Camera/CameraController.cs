using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour {

    public float minimumX = -60f;
    public float maximumX = 60f;
    public float minimumY = -60f;
    public float MaximumY = 60f;
    public float SensitivityX = 5f;
    public float SensitivityY = 5f;

    public Camera cam;

    
    float rotationY = 0f;
    float rotationX = 0f;
    bool camerabewegen = false;
    // Use this for initialization

   
    void Start () {
        Cursor.lockState = CursorLockMode.Locked;
	}
	
	// Update is called once per frame
	void Update () {
        

        if(Input.GetMouseButtonDown(0))
        {
            if (camerabewegen)
            {
                //Cursor.visible = false;
                Cursor.lockState = CursorLockMode.Locked;

                camerabewegen = false;
                cam.transform.localEulerAngles = new Vector3(0, 0, 0);
                //transform.localEulerAngles += new Vector3(0, rotationY, 0);
                //transform.Rotate(new Vector3(0, 1, 0), rotationY);
                transform.GetComponent<PlayerController>().rotationY += rotationY;
                rotationY = 0f;
                rotationX = 0f;

            }
            else
            {
                Cursor.lockState = CursorLockMode.None;
                Cursor.visible = true;
                camerabewegen = true;
            }
        }
  

        if (camerabewegen)
        {
            rotationY += Input.GetAxis("Mouse X") * SensitivityY;
            rotationX += Input.GetAxis("Mouse Y") * SensitivityX;

            rotationX = Mathf.Clamp(rotationX, minimumX, maximumX);
            cam.transform.localEulerAngles = new Vector3(-rotationX, rotationY, 0);
        }
    }
}
