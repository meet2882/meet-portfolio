
        gsap.registerPlugin(ScrollTrigger);

        // --- TIME HUD ---
        function updateTime() {
            const now = new Date();
            document.getElementById('current-time').innerText = now.toTimeString().split(' ')[0];
        }
        setInterval(updateTime, 1000);
        updateTime();

        // --- CUSTOM CURSOR ---
        const cursor = document.getElementById('custom-cursor');
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        });

        document.querySelectorAll('a, button, .group').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.style.width = '40px');
            el.addEventListener('mouseleave', () => cursor.style.width = '12px');
        });

        // --- THREE.JS GLASS ARTIFACT ---
        const canvas = document.getElementById('artifact-canvas');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create a Glass Octahedron
        const geometry = new THREE.OctahedronGeometry(2, 0);
        const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0,
    transmission: 1,
    thickness: 1.5,
    transparent: true,
    opacity: 0.9,
    clearcoat: 1,
    clearcoatRoughness: 0,
});
        const artifact = new THREE.Mesh(geometry, material);
        scene.add(artifact);
        const light1 = new THREE.PointLight(0xffffff, 2);
light1.position.set(5,5,5);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 1);
light2.position.set(-5,-5,-5);
scene.add(light2);

const ambient = new THREE.AmbientLight(0xffffff,0.4);
scene.add(ambient);

        camera.position.z = 6;

        // --- SCROLL ANIMATION FOR 3D ---
        gsap.utils.toArray("section").forEach(section => {
    gsap.from(section, {
        opacity: 0,
        y: 80,
        duration: 1,
        scrollTrigger: {
            trigger: section,
            start: "top 80%"
        }
    });
});
        gsap.to(artifact.rotation, {
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1
            },
            x: Math.PI * 2,
            y: Math.PI * 2
        });

        gsap.to(artifact.position, {
            scrollTrigger: {
                trigger: "#works",
                start: "top bottom",
                end: "top top",
                scrub: 1
            },
            y: 5,
            z: -5
        });

        // --- TYPING ENGINE ---
        const phrases = ["Artificial intelligence(AI).", " Web Development.", "Cybersecurity", "digital futures."];
        let pIdx = 0, cIdx = 0, isDel = false;
        function type() {
            const el = document.getElementById('typing-text');
            const text = phrases[pIdx];
            el.textContent = isDel ? text.substring(0, cIdx--) : text.substring(0, cIdx++);

            if (!isDel && cIdx > text.length) { isDel = true; setTimeout(type, 2000); }
            else if (isDel && cIdx < 0) { isDel = false; pIdx = (pIdx + 1) % phrases.length; setTimeout(type, 500); }
            else setTimeout(type, isDel ? 30 : 60);
        }
        type();

        // --- ANIMATION LOOP ---
        function animate() {
            requestAnimationFrame(animate);
            artifact.rotation.y += 0.003;
artifact.rotation.x += 0.001;
artifact.position.y = Math.sin(Date.now()*0.001) * 0.3;
            renderer.render(scene, camera);
        }
        animate();

        // Resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
        gsap.from("body", {
    opacity: 0,
    duration: 1.2,
    ease: "power2.out"
});
    