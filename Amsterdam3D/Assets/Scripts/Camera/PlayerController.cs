using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PlayerController : MonoBehaviour {
    public float walkspeed;
    public float SensitivityY = 10;
    Rigidbody rb;
    Vector3 moveDirection;
    public float rotationY;
    // Use this for initialization
    void Awake()
    {
        rb = GetComponent<Rigidbody>();
        
    }

    void Start () {
        rotationY = 0f;
    }
	
	// Update is called once per frame
	void Update () {
      //  float horizontalMovement = Input.GetAxisRaw("Horizontal");
        float verticalMovement = Input.GetAxisRaw("Vertical");
        moveDirection = (verticalMovement * transform.forward).normalized;
        
        rotationY += Input.GetAxisRaw("Horizontal") * SensitivityY;
        transform.localEulerAngles = new Vector3(0, rotationY, 0);
    }

    private void FixedUpdate()
    {
        Move();

    }

    void Move()
    {
        Vector3 yVelFix = new Vector3(0, rb.velocity.y, 0);
        rb.velocity = moveDirection * walkspeed * Time.deltaTime;
        rb.velocity += yVelFix;
        
    }
}
