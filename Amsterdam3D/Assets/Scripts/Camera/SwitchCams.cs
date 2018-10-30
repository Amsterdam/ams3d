using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SwitchCams : MonoBehaviour {
    public GameObject spelerObject;
    bool spelerAktief = true;
    Vector3 campositie;
    // Use this for initialization
    void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown("c"))
        {
            if (spelerAktief)
            {
                
                campositie.x = spelerObject.transform.position.x;
                campositie.y = Camera.main.transform.position.y;
                campositie.z = spelerObject.transform.position.z;

                Camera.main.transform.position = campositie;
            }
            else
            {
                campositie.x = Camera.main.transform.position.x;
                campositie.y = 10f;
                campositie.z = Camera.main.transform.position.z;
                spelerObject.transform.position = campositie;
            }
            spelerAktief =! spelerAktief;
                spelerObject.SetActive(spelerAktief);


            
        }
	}
}
